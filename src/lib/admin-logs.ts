import { NextRequest } from 'next/server';
import { createSupabaseAdmin } from './admin-utils';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export type AdminActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ACTIVATE'
  | 'DEACTIVATE'
  | 'TOGGLE_FEATURED'
  | 'TOGGLE_PREMIUM'
  | 'RESET_PROGRESS'
  | 'CHANGE_ROLE'
  | 'BULK_ACTION'
  | 'EXPORT'
  | 'OTHER';

export type AdminEntityType =
  | 'EVENT'
  | 'RESOURCE'
  | 'COURSE'
  | 'USER'
  | 'STARTUP_AWARD'
  | 'LESSON'
  | 'ORDER'
  | 'SYSTEM'
  | 'OTHER';

interface LogAdminActionParams {
  actionType: AdminActionType;
  entityType: AdminEntityType;
  entityId?: string | null;
  description: string;
  details?: Record<string, unknown>;
  request?: NextRequest;
}

/**
 * Registra un'azione amministrativa nel log
 */
export async function logAdminAction({
  actionType,
  entityType,
  entityId = null,
  description,
  details = {},
  request,
}: LogAdminActionParams): Promise<void> {
  try {
    // Ottieni la sessione dell'admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.warn('Tentativo di loggare azione admin senza sessione valida');
      return;
    }

    // Recupera i dati dell'admin
    const supabaseAdmin = createSupabaseAdmin();
    const { data: adminUser } = await supabaseAdmin
      .from('users')
      .select('email, name, last_name')
      .eq('id', session.user.id)
      .single();

    if (!adminUser) {
      console.warn('Admin non trovato nel database');
      return;
    }

    // Prepara i dati del log
    const adminName = adminUser.name
      ? `${adminUser.name}${adminUser.last_name ? ` ${adminUser.last_name}` : ''}`
      : null;

    // Estrai IP e User-Agent dalla richiesta se disponibile
    let ipAddress: string | null = null;
    let userAgent: string | null = null;

    if (request) {
      ipAddress =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        null;
      userAgent = request.headers.get('user-agent') || null;
    }

    // Inserisci il log
    const { error } = await supabaseAdmin.from('admin_logs').insert({
      admin_id: session.user.id,
      admin_email: adminUser.email,
      admin_name: adminName,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      description,
      details: Object.keys(details).length > 0 ? details : null,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Errore nel logging azione admin:', error);
      // Non lanciare errore per non interrompere il flusso principale
    }
  } catch (error) {
    console.error('Errore nel logging azione admin:', error);
    // Non lanciare errore per non interrompere il flusso principale
  }
}

/**
 * Helper per loggare creazioni
 */
export async function logCreate(
  entityType: AdminEntityType,
  entityId: string,
  entityTitle: string,
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    actionType: 'CREATE',
    entityType,
    entityId,
    description: `Creato ${entityType.toLowerCase()}: ${entityTitle}`,
    request,
  });
}

/**
 * Helper per loggare aggiornamenti
 */
export async function logUpdate(
  entityType: AdminEntityType,
  entityId: string,
  entityTitle: string,
  changes: Record<string, unknown>,
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    actionType: 'UPDATE',
    entityType,
    entityId,
    description: `Aggiornato ${entityType.toLowerCase()}: ${entityTitle}`,
    details: { changes },
    request,
  });
}

/**
 * Helper per loggare eliminazioni
 */
export async function logDelete(
  entityType: AdminEntityType,
  entityId: string,
  entityTitle: string,
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    actionType: 'DELETE',
    entityType,
    entityId,
    description: `Eliminato ${entityType.toLowerCase()}: ${entityTitle}`,
    request,
  });
}

/**
 * Helper per loggare azioni bulk
 */
export async function logBulkAction(
  entityType: AdminEntityType,
  actionType: AdminActionType,
  count: number,
  details?: Record<string, unknown>,
  request?: NextRequest
): Promise<void> {
  await logAdminAction({
    actionType: 'BULK_ACTION',
    entityType,
    entityId: null,
    description: `Azione bulk su ${count} ${entityType.toLowerCase()}: ${actionType}`,
    details: { count, actionType, ...details },
    request,
  });
}

