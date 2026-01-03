export const ROLES = {
  SUPER_ADMIN: 'admin',
  SCHOOL_ADMIN: 'staff',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

export const PERMISSIONS = {
  // Global
  SCHOOL_MANAGE: 'school:manage',
  USER_MANAGE: 'user:manage',
  
  // Classes
  CLASS_CREATE: 'class:create',
  CLASS_READ: 'class:read',
  CLASS_UPDATE: 'class:update',
  CLASS_DELETE: 'class:delete',
  CLASS_VIEW_SELF: 'class:view_self',
  
  // Teachers
  TEACHER_MANAGE: 'teacher:manage',
  
  // Students
  STUDENT_MANAGE: 'student:manage',
  STUDENT_VIEW_ASSIGNED: 'student:view_assigned',
  
  // Messages
  MESSAGE_MANAGE: 'message:manage',
  MESSAGE_SEND_PARENTS: 'message:send_parents',
  MESSAGE_CONTACT_TEACHER: 'message:contact_teacher',
  
  // Finance
  FINANCE_MANAGE: 'finance:manage',
  FINANCE_VIEW_CHILD: 'finance:view_child',
  
  // Inventory
  INVENTORY_MANAGE: 'inventory:manage',
  
  // Exams
  EXAM_MANAGE: 'exam:manage',
  EXAM_MANAGE_RESULTS: 'exam:manage_results',
  EXAM_TAKE: 'exam:take',
  
  // Library
  LIBRARY_MANAGE: 'library:manage',
  LIBRARY_BORROW: 'library:borrow',
  
  // Hostel
  HOSTEL_MANAGE: 'hostel:manage',
  HOSTEL_APPLY: 'hostel:apply',
  
  // Transport
  TRANSPORT_MANAGE: 'transport:manage',
  
  // E-Learning
  ELEARNING_MANAGE: 'elearning:manage',
  
  // Attendance
  ATTENDANCE_MANAGE_CLASS: 'attendance:manage_class',
  ATTENDANCE_VIEW_SELF: 'attendance:view_self',
  
  // Child
  CHILD_VIEW_ALL: 'child:view_all',
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  
  [ROLES.SCHOOL_ADMIN]: [ // This now maps to 'staff'
    PERMISSIONS.CLASS_CREATE, PERMISSIONS.CLASS_READ, PERMISSIONS.CLASS_UPDATE, PERMISSIONS.CLASS_DELETE,
    PERMISSIONS.TEACHER_MANAGE,
    PERMISSIONS.STUDENT_MANAGE,
    PERMISSIONS.MESSAGE_MANAGE,
    PERMISSIONS.FINANCE_MANAGE,
    PERMISSIONS.INVENTORY_MANAGE,
    // School admin can view attendance, exams etc implicitly via manage or specific view perms if detailed
  ],
  
  [ROLES.TEACHER]: [
    PERMISSIONS.STUDENT_VIEW_ASSIGNED,
    PERMISSIONS.ATTENDANCE_MANAGE_CLASS,
    PERMISSIONS.MESSAGE_SEND_PARENTS,
    PERMISSIONS.EXAM_MANAGE_RESULTS,
    PERMISSIONS.ELEARNING_MANAGE,
  ],
  
  [ROLES.STUDENT]: [
    PERMISSIONS.ATTENDANCE_VIEW_SELF,
    PERMISSIONS.MESSAGE_CONTACT_TEACHER,
    PERMISSIONS.CLASS_VIEW_SELF,
    PERMISSIONS.EXAM_TAKE,
    PERMISSIONS.LIBRARY_BORROW,
    PERMISSIONS.HOSTEL_APPLY,
  ],
  
  [ROLES.PARENT]: [
    PERMISSIONS.CHILD_VIEW_ALL,
    PERMISSIONS.FINANCE_VIEW_CHILD,
    PERMISSIONS.MESSAGE_CONTACT_TEACHER,
  ],
};
