import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.workspace import Workspace
from app.models.project import Project
from app.models.task import Task
from app.models.comment import Comment
from app.models.notification import Notification
from app.models.activity import Activity
from app.core.security import get_password_hash

def init_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if data already exists
    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database...")

    default_hashed = get_password_hash("password123")

    # Seed Users
    users_data = [
        User(
            id='user-1', name='Alex Morgan', email='alex.morgan@sprintflow.io',
            hashed_password=default_hashed, avatar=None, initials='AM',
            role='Product Manager', department='Engineering', location='San Francisco, CA',
            timezone='America/Los_Angeles', color='#2563EB',
            bio='Building products that people love. PM by day, designer by night.'
        ),
        User(
            id='user-2', name='Sarah Chen', email='sarah@sprintflow.io',
            hashed_password=default_hashed, avatar=None, initials='SC',
            role='Frontend Engineer', department='Engineering', color='#7C3AED'
        ),
        User(
            id='user-3', name='Marcus Lee', email='marcus@sprintflow.io',
            hashed_password=default_hashed, avatar=None, initials='ML',
            role='Backend Engineer', department='Engineering', color='#059669'
        ),
        User(
            id='user-4', name='Priya Sharma', email='priya@sprintflow.io',
            hashed_password=default_hashed, avatar=None, initials='PS',
            role='UX Designer', department='Design', color='#D97706'
        ),
        User(
            id='user-5', name='Jordan Kim', email='jordan@sprintflow.io',
            hashed_password=default_hashed, avatar=None, initials='JK',
            role='DevOps Engineer', department='DevOps', color='#DC2626'
        ),
        User(
            id='user-6', name='Riley Adams', email='riley@sprintflow.io',
            hashed_password=default_hashed, avatar=None, initials='RA',
            role='QA Engineer', department='QA', color='#0891B2'
        ),
    ]
    for u in users_data:
        db.add(u)

    # Seed Workspaces
    workspaces_data = [
        Workspace(
            id='ws-1', name='Engineering Hub',
            description='Central workspace for all engineering teams and technical projects.',
            icon='🚀', color='#2563EB', owner_id='user-1',
            members=['user-1', 'user-2', 'user-3', 'user-5'], project_count=8,
            created_at='2024-01-10', is_owner=True, plan='Pro'
        ),
        Workspace(
            id='ws-2', name='Product & Design',
            description='Design systems, user research, and product planning workspace.',
            icon='🎨', color='#7C3AED', owner_id='user-1',
            members=['user-1', 'user-4'], project_count=5,
            created_at='2024-02-20', is_owner=False, plan='Business'
        ),
        Workspace(
            id='ws-3', name='Marketing Operations',
            description='Campaigns, content creation, and growth initiatives.',
            icon='📊', color='#059669', owner_id='user-1',
            members=['user-1', 'user-6'], project_count=3,
            created_at='2024-03-05', is_owner=False, plan='Starter'
        ),
    ]
    for w in workspaces_data:
        db.add(w)

    # Seed Projects
    projects_data = [
        Project(
            id='proj-1', workspace_id='ws-1', name='SprintFlow v2.0',
            description='Major redesign and feature overhaul of the core platform.',
            status='active', priority='high', start_date='2024-04-01', due_date='2024-07-30',
            progress=68, color='#2563EB', icon='⚡', members=['user-1', 'user-2', 'user-3'],
            task_count=47, completed_tasks=32, tags=['Frontend', 'Backend', 'Design']
        ),
        Project(
            id='proj-2', workspace_id='ws-1', name='API Gateway Migration',
            description='Migrate legacy REST API to GraphQL with improved performance.',
            status='in_progress', priority='urgent', start_date='2024-05-15', due_date='2024-08-15',
            progress=35, color='#7C3AED', icon='🔧', members=['user-3', 'user-5'],
            task_count=28, completed_tasks=10, tags=['Backend', 'Infrastructure']
        ),
        Project(
            id='proj-3', workspace_id='ws-2', name='Design System 3.0',
            description='Build a comprehensive, accessible design system for all products.',
            status='active', priority='medium', start_date='2024-03-01', due_date='2024-09-30',
            progress=52, color='#F59E0B', icon='🎨', members=['user-2', 'user-4'],
            task_count=34, completed_tasks=18, tags=['Design', 'Components']
        ),
        Project(
            id='proj-4', workspace_id='ws-1', name='Mobile App (iOS/Android)',
            description='Native mobile app for SprintFlow using React Native.',
            status='active', priority='high', start_date='2024-06-01', due_date='2024-12-01',
            progress=18, color='#059669', icon='📱', members=['user-1', 'user-2', 'user-4'],
            task_count=62, completed_tasks=11, tags=['Mobile', 'React Native']
        ),
        Project(
            id='proj-5', workspace_id='ws-3', name='Q3 Marketing Campaign',
            description='Multi-channel marketing campaign for product launch.',
            status='on_hold', priority='medium', start_date='2024-07-01', due_date='2024-09-30',
            progress=12, color='#DC2626', icon='📢', members=['user-1', 'user-6'],
            task_count=18, completed_tasks=2, tags=['Marketing', 'Content']
        ),
        Project(
            id='proj-6', workspace_id='ws-1', name='Security Audit 2024',
            description='Comprehensive security review and penetration testing.',
            status='completed', priority='urgent', start_date='2024-02-01', due_date='2024-04-30',
            progress=100, color='#0891B2', icon='🔒', members=['user-3', 'user-5'],
            task_count=23, completed_tasks=23, tags=['Security', 'DevOps']
        ),
    ]
    for p in projects_data:
        db.add(p)

    # Seed Tasks
    tasks_data = [
        Task(
            id='task-1', project_id='proj-1', title='Redesign dashboard with new component library',
            description='Implement the new dashboard design using our updated component library. This includes stats cards, activity section, and chart widgets.',
            status='in_progress', priority='high', assignee_id='user-2', reporter_id='user-1',
            labels=['Frontend', 'Design'], due_date='2024-07-15', created_at='2024-06-01',
            updated_at='2024-07-10', comment_count=8, attachment_count=3,
            subtasks=[
                {'id': 'sub-1', 'title': 'Design mockups', 'done': True},
                {'id': 'sub-2', 'title': 'Component implementation', 'done': True},
                {'id': 'sub-3', 'title': 'Responsive testing', 'done': False},
                {'id': 'sub-4', 'title': 'Accessibility review', 'done': False},
            ],
            estimated_hours=24, logged_hours=18
        ),
        Task(
            id='task-2', project_id='proj-1', title='Implement real-time collaboration features',
            description='Add WebSocket-based real-time updates for collaborative task editing.',
            status='todo', priority='urgent', assignee_id='user-3', reporter_id='user-1',
            labels=['Backend', 'WebSocket'], due_date='2024-07-20', created_at='2024-06-10',
            updated_at='2024-07-08', comment_count=12, attachment_count=1,
            subtasks=[
                {'id': 'sub-5', 'title': 'WebSocket server setup', 'done': False},
                {'id': 'sub-6', 'title': 'Client integration', 'done': False},
                {'id': 'sub-7', 'title': 'Conflict resolution', 'done': False},
            ],
            estimated_hours=40, logged_hours=0
        ),
        Task(
            id='task-3', project_id='proj-1', title='Set up CI/CD pipeline with GitHub Actions',
            description='Configure automated testing, linting, and deployment pipeline using GitHub Actions.',
            status='done', priority='high', assignee_id='user-5', reporter_id='user-3',
            labels=['DevOps', 'Infrastructure'], due_date='2024-07-01', created_at='2024-05-20',
            updated_at='2024-07-02', comment_count=5, attachment_count=2, subtasks=[],
            estimated_hours=16, logged_hours=14
        ),
        Task(
            id='task-4', project_id='proj-1', title='User authentication with OAuth2',
            description='Implement OAuth2 authentication supporting Google, GitHub, and Microsoft SSO providers.',
            status='review', priority='high', assignee_id='user-1', reporter_id='user-1',
            labels=['Auth', 'Security'], due_date='2024-07-12', created_at='2024-06-15',
            updated_at='2024-07-11', comment_count=3, attachment_count=0,
            subtasks=[
                {'id': 'sub-8', 'title': 'Google OAuth setup', 'done': True},
                {'id': 'sub-9', 'title': 'GitHub OAuth setup', 'done': True},
                {'id': 'sub-10', 'title': 'Microsoft SSO', 'done': True},
            ],
            estimated_hours=20, logged_hours=19
        ),
        Task(
            id='task-5', project_id='proj-1', title='Build notification system',
            description='Create a comprehensive notification system with email, push, and in-app notifications.',
            status='todo', priority='medium', assignee_id='user-2', reporter_id='user-1',
            labels=['Feature', 'Backend'], due_date='2024-08-05', created_at='2024-07-01',
            updated_at='2024-07-09', comment_count=2, attachment_count=1, subtasks=[],
            estimated_hours=32, logged_hours=0
        ),
        Task(
            id='task-6', project_id='proj-2', title='GraphQL schema design',
            description='Design the complete GraphQL schema including all types, queries, and mutations.',
            status='done', priority='urgent', assignee_id='user-3', reporter_id='user-3',
            labels=['Architecture', 'GraphQL'], due_date='2024-06-15', created_at='2024-05-20',
            updated_at='2024-06-16', comment_count=15, attachment_count=4, subtasks=[],
            estimated_hours=24, logged_hours=26
        ),
        Task(
            id='task-7', project_id='proj-2', title='Migrate user endpoints to GraphQL',
            description='Convert all user-related REST endpoints to GraphQL resolvers.',
            status='in_progress', priority='high', assignee_id='user-3', reporter_id='user-3',
            labels=['Backend', 'Migration'], due_date='2024-07-25', created_at='2024-06-20',
            updated_at='2024-07-10', comment_count=7, attachment_count=0,
            subtasks=[
                {'id': 'sub-11', 'title': 'GET /users endpoint', 'done': True},
                {'id': 'sub-12', 'title': 'POST /users endpoint', 'done': True},
                {'id': 'sub-13', 'title': 'DELETE /users endpoint', 'done': False},
            ],
            estimated_hours=16, logged_hours=11
        ),
        Task(
            id='task-8', project_id='proj-1', title='Performance optimization & code splitting',
            description='Analyze and optimize bundle size, implement lazy loading, and code splitting.',
            status='review', priority='medium', assignee_id='user-2', reporter_id='user-1',
            labels=['Performance', 'Frontend'], due_date='2024-07-18', created_at='2024-07-01',
            updated_at='2024-07-13', comment_count=4, attachment_count=2, subtasks=[],
            estimated_hours=12, logged_hours=10
        ),
    ]
    for t in tasks_data:
        db.add(t)

    # Seed Comments
    comments_data = [
        Comment(
            id='comment-1', task_id='task-1', author_id='user-1',
            content='The mockups look great! Just a few tweaks needed on the mobile view. Can we increase the card spacing on mobile?',
            created_at='2024-07-10T09:30:00Z', reactions=[{'emoji': '👍', 'count': 3}, {'emoji': '🔥', 'count': 1}]
        ),
        Comment(
            id='comment-2', task_id='task-1', author_id='user-2',
            content='Updated the mobile spacing. Also added a condensed view for smaller screens. LGTM on the desktop version!',
            created_at='2024-07-10T11:15:00Z', reactions=[{'emoji': '✅', 'count': 2}]
        ),
        Comment(
            id='comment-3', task_id='task-1', author_id='user-4',
            content='Could we also add dark mode support here? Would be great to have it consistent with the rest of the app.',
            created_at='2024-07-11T14:00:00Z', reactions=[]
        ),
    ]
    for c in comments_data:
        db.add(c)

    # Seed Notifications
    notifications_data = [
        Notification(
            id='notif-1', type='mention', title='Alex Morgan mentioned you',
            description='in task "Redesign dashboard with new component library"',
            is_read=False, created_at='2024-07-13T10:30:00Z', link='/tasks/task-1',
            avatar='AM', avatar_color='#2563EB', is_system_notif=False, user_id='user-1'
        ),
        Notification(
            id='notif-2', type='assignment', title='Task assigned to you',
            description='"Build notification system" has been assigned to you by Alex Morgan',
            is_read=False, created_at='2024-07-13T09:15:00Z', link='/tasks/task-5',
            avatar='AM', avatar_color='#2563EB', is_system_notif=False, user_id='user-1'
        ),
        Notification(
            id='notif-3', type='comment', title='New comment on your task',
            description='Priya Sharma commented on "Redesign dashboard"',
            is_read=False, created_at='2024-07-12T16:45:00Z', link='/tasks/task-1',
            avatar='PS', avatar_color='#D97706', is_system_notif=False, user_id='user-1'
        ),
        Notification(
            id='notif-4', type='status_change', title='Task status updated',
            description='"Set up CI/CD pipeline" was moved to Done by Jordan Kim',
            is_read=True, created_at='2024-07-12T11:20:00Z', link='/tasks/task-3',
            avatar='JK', avatar_color='#DC2626', is_system_notif=False, user_id='user-1'
        ),
        Notification(
            id='notif-5', type='due_date', title='Task due soon',
            description='"User authentication with OAuth2" is due tomorrow',
            is_read=True, created_at='2024-07-11T08:00:00Z', link='/tasks/task-4',
            avatar='⏰', avatar_color='#F59E0B', is_system_notif=True, user_id='user-1'
        ),
    ]
    for n in notifications_data:
        db.add(n)

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    init_db()
