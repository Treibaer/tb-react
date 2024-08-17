export const ROUTES = {
  HOME: '/',

  PROJECTS: '/projects',
  TICKET_DETAILS: (projectSlug: string, ticketSlug: string) => `/projects/${projectSlug}/tickets/${ticketSlug}`,
  BOARD_DETAILS: (projectSlug: string, boardId: number) => `/projects/${projectSlug}/boards/${boardId}`,
  BOARDS: (projectSlug: string) => `/projects/${projectSlug}/boards`,
  TICKETS_LIST: (projectSlug: string) => `/projects/${projectSlug}/tickets/all`,
  TICKETS_BOARD_VIEW: (projectSlug: string) => `/projects/${projectSlug}/tickets`,


  DASHBOARD: '/dashboard',
  PROJECT: '/projects/:slug',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
};
