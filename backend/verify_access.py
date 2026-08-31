import asyncio
from app.api.v1 import projects, tasks
from app.core.database import SessionLocal
from app.models.user import User
from app.models.project import Project
from app.schemas.project import ProjectCreate
from fastapi import HTTPException

async def run_direct_tests():
    print("--- Starting Direct Function Access Control Verification ---")
    db = SessionLocal()
    
    admin_user = db.query(User).filter(User.id == "user-0").first()
    sarah_user = db.query(User).filter(User.id == "user-2").first()
    
    assert admin_user is not None, "Admin user exists"
    assert sarah_user is not None, "Sarah Chen user exists"
    
    # 1. Admin gets all projects
    all_projs = await projects.get_projects(db=db, current_user=admin_user)
    print(f"Admin sees {len(all_projs)} projects.")
    assert len(all_projs) >= 6
    
    # 2. Sarah Chen only gets assigned projects
    sarah_projs = await projects.get_projects(db=db, current_user=sarah_user)
    sarah_ids = [p["id"] for p in sarah_projs]
    print(f"Sarah Chen sees {len(sarah_projs)} projects: {sarah_ids}")
    assert "proj-2" not in sarah_ids
    for p in sarah_projs:
        assert "user-2" in p["members"]
        
    # 3. Sarah trying to get proj-2 directly throws 403 Forbidden
    try:
        await projects.get_project(project_id="proj-2", db=db, current_user=sarah_user)
        assert False, "Should have raised 403 Forbidden"
    except HTTPException as e:
        print(f"Sarah accessing proj-2 threw expected HTTP {e.status_code}: {e.detail}")
        assert e.status_code == 403
        
    # 4. Admin adds Sarah Chen to proj-2
    res = await projects.add_project_members(project_id="proj-2", payload={"userId": "user-2"}, db=db, current_user=admin_user)
    assert "user-2" in res["members"]
    print("Admin added Sarah Chen (user-2) to proj-2.")
    
    # 5. Sarah now gets proj-2
    sarah_projs_after = await projects.get_projects(db=db, current_user=sarah_user)
    sarah_ids_after = [p["id"] for p in sarah_projs_after]
    print(f"Sarah Chen now sees {len(sarah_projs_after)} projects: {sarah_ids_after}")
    assert "proj-2" in sarah_ids_after
    
    # 6. Sarah can fetch tasks for proj-2
    proj2_tasks = await tasks.get_tasks(project_id="proj-2", db=db, current_user=sarah_user)
    print(f"Sarah fetched {len(proj2_tasks)} tasks from proj-2.")
    assert len(proj2_tasks) > 0
    
    # 7. Admin removes Sarah from proj-2
    res_del = await projects.remove_project_member(project_id="proj-2", user_id="user-2", db=db, current_user=admin_user)
    assert "user-2" not in res_del["members"]
    print("Admin removed Sarah from proj-2.")
    
    # 8. Sarah no longer sees proj-2
    sarah_projs_final = await projects.get_projects(db=db, current_user=sarah_user)
    sarah_ids_final = [p["id"] for p in sarah_projs_final]
    assert "proj-2" not in sarah_ids_final
    print("Sarah no longer sees proj-2.")
    
    db.close()
    print("\n--- ALL ACCESS CONTROL TESTS PASSED SUCCESSFULLY! ---")

if __name__ == "__main__":
    asyncio.run(run_direct_tests())
