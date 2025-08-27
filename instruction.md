# instruction.md

## File Purpose
This file contains instructions and best practices to follow for structuring and developing a React project in a professional and scalable way. It must be read by GitHub Copilot at every interaction to ensure consistency and code quality.

---

## ROLE - AI Assistant Role
Always act as a **senior React/TypeScript developer** with expertise in:
- Scalable and modular architectures
- Modern development best practices
- Testing and code quality
- Performance optimization
- **Responsive Design** and Mobile-First approach
- **CSV-based data management** with future database migration planning
- Accessibility (a11y) and UX
- Clean code and SOLID principles
- Advanced state management (Redux Toolkit, Zustand)
- Design patterns and enterprise architectures

**Approach:** Always provide professional, well-structured, typed and documented solutions. Always consider scalability, maintainability and performance. **CRITICAL: Every component and layout MUST be fully responsive** for mobile and desktop usage. **DATA STRATEGY: Use CSV files for initial data storage while designing for easy database migration.** Suggest improvements when appropriate.

---

## 1. Folder Structure

- `/src` — Contains all application source code.
  - `/components` — Reusable and presentational components.
  - `/features` — Functional modules (feature-based), each with its own components, Redux slices, hooks, etc.
  - `/pages` — Main app pages (for routing).
  - `/hooks` — Reusable custom hooks.
  - `/utils` — Utility functions and helpers (including CSV parsing utilities).
  - `/services` — Functions for API calls and business logic (including CSV data services).
  - `/data` — **CSV files for data storage** (users, products, etc.).
  - `/assets` — Static files (images, icons, fonts, etc.).
  - `/styles` — Global style files (CSS, SCSS, styled-components theme, etc.).
  - `/store` — Global store configuration (Redux, Zustand, etc.).
  - `/types` — Shared TypeScript typings (including data models for CSV structures).

---

## 2. Naming Convention
- Use descriptive names and camelCase for variables and functions.
- Use PascalCase for component names and component files.
- Feature and component folders should be in lowercase.

---

## 3. Components
- Components should be as "dumb" (presentational) as possible and receive data through props.
- Separate presentational components from container components (which handle logic).
- Each component must have a `.tsx` file and, if necessary, a `.module.css`/`.module.scss` file or styled-components.
- Write tests for each component (unit tests and snapshots).

---

## 4. State Management
- Use Redux Toolkit, Zustand or Context API for global state.
- Local state should be managed with React hooks (`useState`, `useReducer`).
- Organize state by feature, not by type (e.g.: `/features/todo/todoSlice.ts`).

---

## 5. Routing
- Use React Router DOM for route management.
- Pages go in `/pages` and each page can import necessary components.

---

## 6. API Calls & Data Storage
- **DATA STORAGE STRATEGY**: Use CSV files for initial data storage and management
  - All UI data must be stored in CSV format in `/src/data/` directory
  - Admin user data additions/modifications should update CSV files
  - Implement CSV parsing utilities in `/src/utils/csvHelpers.ts`
  - Plan for future database migration (design data structures accordingly)
- Centralize API calls in `/services`.
- Create data access layer that abstracts CSV operations (easy to replace with DB later).
- Use axios or fetch with custom hooks (`useApi`, `useQuery`, etc.).
- Handle loading, error and success states.
- Implement CRUD operations for CSV data:
  - **Create**: Add new rows to CSV
  - **Read**: Parse and display CSV data
  - **Update**: Modify existing CSV entries
  - **Delete**: Remove rows from CSV files

**CSV Data Management:**
- Use Papa Parse library for robust CSV handling
- Implement data validation before CSV operations
- Create backup mechanism for CSV files
- Design CSV schema that can easily map to future database tables

---

## 7. Design System & UI Libraries
- **PRIMARY UI FRAMEWORK**: Always use **Material-UI (MUI)** as the primary component library
  - Leverage Material Design principles for consistent UX
  - Use MUI's responsive grid system and breakpoints
  - Customize MUI theme to match project branding
  - Utilize MUI icons and Material Design iconography
- **SECONDARY FRAMEWORK**: Use **Bootstrap** for additional layout utilities and responsive helpers
  - Bootstrap grid system for complex layouts when needed
  - Bootstrap utilities for spacing, typography, and responsive design
  - Bootstrap components can complement MUI when appropriate
- **DESIGN CONSISTENCY**: 
  - Prioritize MUI components over custom implementations
  - Use MUI's theming system for colors, typography, and spacing
  - Follow Material Design guidelines for component behavior and interaction

## 8. Styles & Responsive Design
- **MOBILE-FIRST APPROACH**: Always design for mobile first, then enhance for desktop.
- **PRIMARY LAYOUT SYSTEM**: Use MUI's Grid and Container components for responsive layouts.
- **SECONDARY LAYOUT**: Use Bootstrap's grid system and CSS Grid/Flexbox when MUI is insufficient.
- Implement responsive breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+).
- Prefer MUI's sx prop and styled() API over external CSS when possible.
- Use relative units (rem, em, %, vw, vh) instead of fixed pixels where possible.
- Implement touch-friendly interfaces (minimum 44px touch targets).
- Test components on multiple screen sizes during development.
- Consider responsive typography using MUI's Typography component with responsive variants.
- Maintain consistent styling using MUI theme configuration in `/styles`.

**Responsive Testing Checklist:**
- ✅ Mobile portrait/landscape (320px - 767px)
- ✅ Tablet portrait/landscape (768px - 1023px)  
- ✅ Desktop (1024px+)
- ✅ Touch interactions work properly
- ✅ Text remains readable at all sizes
- ✅ MUI breakpoints work correctly across devices
- ✅ Bootstrap utilities enhance responsive behavior

---

## 9. Typing
- Use TypeScript everywhere.
- Define types and interfaces in `/types` and import them where needed.
- Use MUI's TypeScript definitions and theme typing for better development experience.

---

## 10. Testing
- Use Jest and React Testing Library.
- Write tests for components, hooks, services and utility functions.
- Test MUI component customizations and responsive behavior.

---

## 11. Linting & Formatting
- Use ESLint for code linting.
- Use Prettier for automatic formatting.
- Configure Husky for pre-commit hooks.

---

## 12. General Best Practices
- Write readable and documented code.
- Avoid code duplication.
- Use React Fragments (`<>...</>`) instead of unnecessary divs.
- Handle errors explicitly.
- Write comments only where necessary.
- **DESIGN SYSTEM REQUIREMENTS:**
  - Always use MUI components as the first choice for UI elements
  - Use Bootstrap utilities to enhance layouts when MUI is insufficient
  - Maintain design consistency through MUI theming
  - Follow Material Design principles for user interactions
- **RESPONSIVE REQUIREMENTS:**
  - Every component must work seamlessly on mobile and desktop
  - Use semantic HTML for better accessibility and responsive behavior
  - Implement proper viewport meta tag in index.html
  - Test layouts with browser dev tools device emulation
  - Consider performance on mobile networks (lazy loading, code splitting)
  - Use responsive images with srcSet and sizes attributes

---

## 13. Deployment & Data Management
- Use environment variables for sensitive configurations.
- Separate development, staging and production environments.
- **CSV Data Deployment:**
  - Include CSV files in build process
  - Implement CSV file validation in CI/CD pipeline
  - Create migration scripts for future database transition
  - Plan data backup and recovery strategies
  - Document CSV schema and data relationships

---

## 14. Documentation
- Always update this file in case of structural changes.
- Document main architectural decisions.

---

> **Note:** Always follow these guidelines to keep the project scalable, maintainable and professional. **CRITICAL REQUIREMENT: The entire application MUST be fully responsive and optimized for both mobile and desktop usage. Every component, layout, and interaction should provide an excellent user experience across all device sizes. Use Material-UI as the primary design system with Bootstrap as a complementary framework for enhanced responsive behavior.**
