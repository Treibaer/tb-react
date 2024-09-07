export const ROUTES = {
  HOME: '/',

  PROJECTS: '/projects',
  TICKET_DETAILS: (projectSlug: string, ticketSlug: string) => `/projects/${projectSlug}/tickets/${ticketSlug}`,
  BOARD_DETAILS: (projectSlug: string, boardId: number) => `/projects/${projectSlug}/boards/${boardId}`,
  BOARDS: (projectSlug: string) => `/projects/${projectSlug}/boards`,
  TICKETS_LIST: (projectSlug: string) => `/projects/${projectSlug}/tickets/all`,
  TICKETS_BOARD_VIEW: (projectSlug: string) => `/projects/${projectSlug}/tickets`,
  PROJECT_DETAILS: (projectSlug: string) => `/projects/${projectSlug}`,
  BOARD_STRUCTURE: (projectSlug: string) => `/projects/${projectSlug}/tickets-board-structure`,


  DASHBOARD: '/dashboard',
  PROJECT: '/projects/:slug',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  STATUS: '/status',
  FINANCE_DASHBOARD: '/finances',
  FINANCE_DETAILS: '/finances/details',
  FINANCE_SUMMARY: '/finances/summary',
  NOT_FOUND: '/404',
};
