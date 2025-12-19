'use client';

import { Event } from '@/lib/events';

interface EventCardProps {
  event: Event;
  variant?: 'default' | 'featured';
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
  if (variant === 'featured') {
    return (
      <div className="partner-event-card">
        <div className="partner-logo">
          <div className="logo-container">
            <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
        </div>
        <div className="partner-event-content">
          <div className="partner-tag">{event.partner}</div>
          <h3 className="partner-event-title">{event.title}</h3>
          <p className="partner-event-description">{event.description}</p>
          <div className="partner-event-details">
            <div className="detail-row">
              <span className="detail-label">📅 Data:</span>
              <span className="detail-value">{event.date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">📍 Luogo:</span>
              <span className="detail-value">{event.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">🎫 Biglietti:</span>
              <span className="detail-value">{event.ticketPrice}</span>
            </div>
          </div>
          <a 
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="partner-event-btn"
          >
            Acquista Biglietti
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    );
  }

  // Variante default per homepage
  return (
    <div className="event-card">
      <div className="event-logo">
        <div className="logo-container">
          <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
      </div>
      <div className="event-content">
        <div className="event-tag">{event.partner}</div>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        <div className="event-details">
          <div className="detail-row">
            <span className="detail-label">📅 Data:</span>
            <span className="detail-value">{event.date}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📍 Luogo:</span>
            <span className="detail-value">{event.location}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🎫 Biglietti:</span>
            <span className="detail-value">{event.ticketPrice}</span>
          </div>
        </div>
        <a 
          href={event.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="event-btn"
        >
          Acquista Biglietti
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

