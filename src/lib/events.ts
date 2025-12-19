import eventsData from '@/config/events.json';

export interface Event {
  id: string;
  title: string;
  partner: string;
  description: string;
  date: string;
  location: string;
  ticketPrice: string;
  ticketUrl: string;
  image: string | null;
  featured: boolean;
  active: boolean;
}

/**
 * Recupera tutti gli eventi attivi
 */
export function getActiveEvents(): Event[] {
  return eventsData.events.filter(event => event.active);
}

/**
 * Recupera gli eventi featured (in evidenza)
 */
export function getFeaturedEvents(): Event[] {
  return eventsData.events.filter(event => event.featured && event.active);
}

/**
 * Recupera un evento specifico per ID
 */
export function getEventById(id: string): Event | undefined {
  return eventsData.events.find(event => event.id === id && event.active);
}

/**
 * Recupera tutti gli eventi (inclusi quelli non attivi)
 */
export function getAllEvents(): Event[] {
  return eventsData.events;
}

