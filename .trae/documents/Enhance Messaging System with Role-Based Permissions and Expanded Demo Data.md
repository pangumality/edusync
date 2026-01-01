I will upgrade the existing frontend messaging system to fully support the requested role-based communication rules and expand the demo data.

### 1. Enhance Demo Data (`frontend/src/utils/seed.js`)
I will add new seed functions to generate missing roles:
- **Super Admins** & **Admins**
- **Librarians**
- **Parents** (linked to Students)

### 2. Implement Role-Based Permission Logic
I will implement a strict permission matrix in the `Messages` page to control who can start conversations with whom:
- **Super Admin** ➝ Admins
- **Admin** ➝ Everyone
- **Teacher** ➝ Parents, Students
- **Librarian** ➝ Students, Teachers
- *(Inferred)* **Student** ➝ Teachers, Librarians
- *(Inferred)* **Parent** ➝ Teachers

### 3. Upgrade Messages UI (`frontend/src/pages/Messages/index.jsx`)
- **User Switcher for Demo**: I will add a "Switch User" dropdown in the Messages interface. This will allow you to instantly toggle between acting as a Super Admin, Teacher, Librarian, etc., to verify the different permission rules.
- **Dynamic Recipient Filtering**: The "New Message" modal will dynamically filter the list of available users based on the currently selected role's permissions.

### 4. Dynamic Layout (`frontend/src/layouts/DashboardLayout.jsx`)
- Update the header to display the currently selected mock user's name and role instead of the hardcoded "Admin KORA", ensuring the demo feels real.

**Outcome**: You will have a fully interactive demo where you can switch roles and see the allowed messaging options change dynamically according to your requirements.