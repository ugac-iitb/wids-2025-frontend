# =======================
# Mentor APIs
@api_view(["GET"])
@authentication_classes([BearerOAuthAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def api_mentor_projects(request):
    """
    GET /api/mentor/projects
    Returns projects where request.user is owner or co_mentor.
    """
    user = request.user
    qs = Project.objects.filter(is_active=True).filter(
        models.Q(owner=user) | models.Q(co_mentor=user)
    ).order_by("-updated_at")

    items = []
    for p in qs:
        wish_count = Wishlist.objects.filter(project=p).count()
        pref_count = Preference.objects.filter(project=p).count()
        items.append({
            "id": p.id,
            "project_title": p.title,
            "project_domain_1": p.domain1,
            "project_domain_2": p.domain2 or None,
            "difficulty": p.difficulty,
            "project_type": p.project_type,
            "updated_at": p.updated_at.isoformat(),
            "wish_count": wish_count,
            "preference_count": pref_count,
        })

    return JsonResponse({"ok": True, "projects": items})


@api_view(["GET"])
@authentication_classes([BearerOAuthAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def api_mentor_project_sops(request, pk: int):
    """
    GET /api/mentor/project/<pk>/sops
    Returns project details + list of SOPs (preferences) for that project.
    Only accessible to owner, co_mentor or staff.
    Response:
    {
      "ok": True,
      "project": { ... },
      "sops": [
        { "user_id": 12, "user_name": "A B", "sop": "...", "rank": 1|null, "submitted_at": "...", "updated_at": "..." },
        ...
      ]
    }
    """
    p = get_object_or_404(Project, pk=pk, is_active=True)
    if not _is_project_mentor(request.user, p):
        return JsonResponse({"ok": False, "error": "forbidden"}, status=403)

    # Order: rank ASC (nulls last), then submitted_at ascending
    prefs_qs = Preference.objects.filter(project=p).select_related("user").order_by(
        models.F("rank").asc(nulls_last=True), "submitted_at"
    )

    sops = []
    for pref in prefs_qs:
        u = pref.user
        sops.append({
            "user_id": u.id,
            "user_name": getattr(u, "name", None),
            "user_email": getattr(u, "email", None),
            "sop": pref.sop,
            "rank": pref.rank,
            "submitted_at": pref.submitted_at.isoformat(),
            "updated_at": pref.updated_at.isoformat(),
        })

    project_data = {
        "id": p.id,
        "project_title": p.title,
        "project_domain_1": p.domain1,
        "project_domain_2": p.domain2 or None,
        "project_description": p.description,
        "difficulty": p.difficulty,
        "project_type": p.project_type,
        "duration_weeks": p.duration_weeks,
        "weekly_hours": p.weekly_hours,
        "number_of_mentees": p.num_mentees,
        "resources_link": p.resources_link,
        "previously_completed": p.previously_completed,
        "updated_at": p.updated_at.isoformat(),
    }

    return JsonResponse({"ok": True, "project": project_data, "sops": sops})


@api_view(["POST"])
@authentication_classes([BearerOAuthAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def api_mentor_update_rankings(request, pk: int):
    """
    POST /api/mentor/project/<pk>/rankings
    Body JSON: { "rankings": [ {"user_id": <int>, "rank": <int|null>}, ... ] }
    Only owner/co_mentor or staff can call.
    Validations:
      - Only updates Preference rows for the given project.
      - Ranks must be integers in [1, 32767] or null.
      - Ranks must be unique (excluding nulls).
    Returns updated list of preferences after update.
    """
    p = get_object_or_404(Project, pk=pk, is_active=True)
    if not _is_project_mentor(request.user, p):
        return JsonResponse({"ok": False, "error": "forbidden"}, status=403)

    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "bad_json"}, status=400)

    rankings = payload.get("rankings")
    if not isinstance(rankings, list):
        return JsonResponse({"ok": False, "error": "rankings_array_required"}, status=400)

    # collect mapping and validate types
    user_ids = []
    rank_values = []
    mapping = {}
    for entry in rankings:
        if not isinstance(entry, dict) or "user_id" not in entry:
            return JsonResponse({"ok": False, "error": "each_entry_must_have_user_id"}, status=400)
        try:
            uid = int(entry["user_id"])
        except Exception:
            return JsonResponse({"ok": False, "error": "invalid_user_id"}, status=400)
        rank = entry.get("rank", None)
        if rank is None:
            rank_val = None
        else:
            try:
                rank_val = int(rank)
            except Exception:
                return JsonResponse({"ok": False, "error": "invalid_rank_value"}, status=400)
            if not (0 < rank_val <= 32767):
                return JsonResponse({"ok": False, "error": "rank_out_of_range"}, status=400)
            rank_values.append(rank_val)
        user_ids.append(uid)
        mapping[uid] = rank_val

    # unique ranks check (excluding null)
    if len(rank_values) != len(set(rank_values)):
        return JsonResponse({"ok": False, "error": "duplicate_ranks"}, status=400)

    # Fetch preferences that belong to this project
    prefs = Preference.objects.filter(project=p, user_id__in=user_ids).select_for_update()

    prefs_map = {pref.user_id: pref for pref in prefs}
    missing = [uid for uid in user_ids if uid not in prefs_map]
    if missing:
        return JsonResponse({"ok": False, "error": "preferences_not_found", "missing_user_ids": missing}, status=400)

    # Apply updates inside transaction
    updated = []
    try:
        with transaction.atomic():
            for uid, new_rank in mapping.items():
                pref = prefs_map[uid]
                # normalize None vs existing
                if pref.rank != new_rank:
                    pref.rank = new_rank
                    pref.save(update_fields=["rank", "updated_at"])
                updated.append({
                    "user_id": pref.user_id,
                    "rank": pref.rank,
                    "updated_at": pref.updated_at.isoformat()
                })
    except ValidationError as e:
        return JsonResponse({"ok": False, "error": "validation_failed", "details": e.message_dict}, status=400)

    # Return full current list after update (ordered)
    prefs_qs = Preference.objects.filter(project=p).select_related("user").order_by(
        models.F("rank").asc(nulls_last=True), "submitted_at"
    )
    sops = []
    for pref in prefs_qs:
        sops.append({
            "user_id": pref.user_id,
            "user_name": getattr(pref.user, "name", None),
            "sop": pref.sop,
            "rank": pref.rank,
            "submitted_at": pref.submitted_at.isoformat(),
            "updated_at": pref.updated_at.isoformat(),
        })
    return JsonResponse({"ok": True, "updated": updated, "sops": sops})


@api_view(["GET"])
@authentication_classes([BearerOAuthAuthentication, SessionAuthentication])
@permission_classes([IsAuthenticated])
def api_mentor_project_my_rankings(request, pk: int):
    """
    GET /api/mentor/project/<pk>/my_rankings

    Returns ONLY the rankings saved by the calling mentor for this project,
    including:
      - student_id
      - student_name
      - student_email
      - student_roll_no
      - sop
      - rank

    Response:
    {
      "ok": true,
      "project_id": 42,
      "rankings": [
        {
          "student_id": 12,
          "student_name": "Alice",
          "student_email": "alice@iitb.ac.in",
          "student_roll_no": "23B1234",
          "rank": 1,
          "sop": "My motivation..."
        },
        ...
      ]
    }
    """
    project = get_object_or_404(Project, pk=pk, is_active=True)

    # Only owner, co_mentor, or staff may access
    if not (request.user.is_staff or _is_project_mentor(request.user, project)):
        return JsonResponse({"ok": False, "error": "forbidden"}, status=403)

    mentor = request.user
    from .models import Ranking

    # rankings saved by this mentor
    rows = (
        Ranking.objects.filter(project=project, mentor=mentor)
        .select_related("student")
        .order_by(models.F("rank").asc(nulls_last=True), "updated_at")
    )

    # fetch SOPs from Preference table
    student_ids = [r.student_id for r in rows]
    prefs_map = {}
    if student_ids:
        prefs = Preference.objects.filter(
            project=project,
            user_id__in=student_ids
        ).values("user_id", "sop")
        prefs_map = {p["user_id"]: p["sop"] for p in prefs}

    rankings = []
    for r in rows:
        stu = r.student
        rankings.append({
            "student_id": stu.id,
            "student_name": stu.name,
            "student_email": stu.email,
            "student_roll_no": stu.roll_no,
            "rank": r.rank,
            "sop": prefs_map.get(r.student_id),
        })

    return JsonResponse({
        "ok": True,
        "project_id": project.id,
        "rankings": rankings,
    })