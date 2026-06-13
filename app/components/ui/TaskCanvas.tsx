'use client';

import { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Circle,
  Link2,
  Plus,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import { FounderTask, useStore } from '@/lib/useStore';
import { colors, spacing, radius, typography, transitions, shadows, layout, components } from '@/styles/tokens';

const ROLE_OPTIONS: FounderTask['role'][] = ['founder', 'ops', 'growth', 'product', 'finance'];
const STATUS_OPTIONS: FounderTask['status'][] = ['todo', 'doing', 'blocked', 'done'];

export default function TaskCanvas({
  isOpen,
  onClose,
  ventureId,
}: {
  isOpen: boolean;
  onClose: () => void;
  ventureId?: string | null;
}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const {
    ventures,
    tasks,
    taskConnections,
    addTask,
    updateTask,
    deleteTask,
    addTaskConnection,
    deleteTaskConnection,
    saveTaskToDb,
    deleteTaskFromDb,
  } = useStore();
  const [draft, setDraft] = useState({
    title: '',
    ventureId: ventures[0]?.id || '',
    role: 'founder' as FounderTask['role'],
    deadline: '2026-05-22',
    notes: '',
  });
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [linkStartId, setLinkStartId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const idCounterRef = useRef(0);

  const taskMap = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const selectedVenture = ventures.find((venture) => venture.id === ventureId) ?? null;
  const displayedTasks = useMemo(() => {
    if (!ventureId) return tasks;
    const ids = new Set(tasks.filter((task) => task.ventureId === ventureId).map((task) => task.id));
    let changed = true;
    while (changed) {
      changed = false;
      taskConnections.forEach((connection) => {
        if (ids.has(connection.fromTaskId) && !ids.has(connection.toTaskId)) {
          ids.add(connection.toTaskId);
          changed = true;
        }
        if (ids.has(connection.toTaskId) && !ids.has(connection.fromTaskId)) {
          ids.add(connection.fromTaskId);
          changed = true;
        }
      });
    }
    return tasks.filter((task) => ids.has(task.id));
  }, [taskConnections, tasks, ventureId]);
  const displayedTaskMap = useMemo(() => new Map(displayedTasks.map((task) => [task.id, task])), [displayedTasks]);
  const visibleConnections = taskConnections.filter(
    (connection) => displayedTaskMap.has(connection.fromTaskId) && displayedTaskMap.has(connection.toTaskId)
  );
  const activeDraftVentureId = ventureId || draft.ventureId || ventures[0]?.id || '';

  if (!isOpen) return null;

  const addNewTask = () => {
    const title = draft.title.trim();
    if (!title) return;

    const newTask: FounderTask = {
      id: `task-${tasks.length + 1}-${++idCounterRef.current}`,
      title,
      ventureId: activeDraftVentureId || undefined,
      role: draft.role,
      deadline: draft.deadline,
      notes: draft.notes.trim(),
      status: 'todo',
      position: {
        x: selectedVenture ? 380 + (displayedTasks.length % 3) * 285 : 160 + (tasks.length % 3) * 270,
        y: selectedVenture ? 170 + Math.floor(displayedTasks.length / 3) * 165 : 150 + Math.floor(tasks.length / 3) * 150,
      },
    };

    addTask(newTask);
    // Persist to database
    saveTaskToDb(newTask).catch(console.error);

    setDraft((value) => ({ ...value, title: '', notes: '' }));
  };

  const beginDrag = (taskId: string, event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, input, select, textarea')) return;
    const board = boardRef.current;
    const task = taskMap.get(taskId);
    if (!board || !task) return;

    const rect = board.getBoundingClientRect();
    const startX = event.clientX / zoom;
    const startY = event.clientY / zoom;
    const origin = task.position;
    setDraggingId(taskId);
    event.currentTarget.setPointerCapture(event.pointerId);

    const onMove = (moveEvent: PointerEvent) => {
      updateTask(taskId, {
        position: {
          x: Math.max(18, Math.min(rect.width / zoom - 250, origin.x + moveEvent.clientX / zoom - startX)),
          y: Math.max(18, Math.min(rect.height / zoom - 140, origin.y + moveEvent.clientY / zoom - startY)),
        },
      });
    };

    const onUp = () => {
      setDraggingId(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleLinkClick = (taskId: string) => {
    if (!linkStartId) {
      setLinkStartId(taskId);
      return;
    }

    if (linkStartId !== taskId) {
      const exists = taskConnections.some(
        (connection) =>
          connection.fromTaskId === linkStartId && connection.toTaskId === taskId
      );
      if (!exists) {
        addTaskConnection({
          id: `task-link-${taskConnections.length + 1}-${++idCounterRef.current}`,
          fromTaskId: linkStartId,
          toTaskId: taskId,
        });
      }
    }
    setLinkStartId(null);
  };

  const statusCounts = STATUS_OPTIONS.map((status) => ({
    status,
    count: displayedTasks.filter((task) => task.status === status).length,
  }));

  return (
    <div style={overlayStyle}>
      <div style={shellStyle}>
        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>{selectedVenture ? selectedVenture.name : 'Founder task canvas'}</div>
            <h2 style={titleStyle}>
              {selectedVenture ? 'Venture task canvas with connected dependencies' : 'Tasks, owners, ventures, deadlines, notes, and dependencies'}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {statusCounts.map((item) => (
              <span key={item.status} style={metricPillStyle}>
                {item.status} <b>{item.count}</b>
              </span>
            ))}
            <span style={metricPillStyle}>zoom <b>{Math.round(zoom * 100)}%</b></span>
            <button onClick={onClose} style={iconButtonStyle} aria-label="Close task canvas">
              <X size={16} />
            </button>
          </div>
        </header>

        <section style={composerStyle}>
          <input
            value={draft.title}
            onChange={(event) => setDraft((value) => ({ ...value, title: event.target.value }))}
            onKeyDown={(event) => {
              if (event.key === 'Enter') addNewTask();
            }}
            placeholder="Add a task for yourself"
            style={{ ...fieldStyle, minWidth: '230px', flex: 1 }}
          />
          <select
            value={activeDraftVentureId}
            onChange={(event) => setDraft((value) => ({ ...value, ventureId: event.target.value }))}
            style={fieldStyle}
          >
            {ventures.map((venture) => (
              <option key={venture.id} value={venture.id}>
                {venture.name}
              </option>
            ))}
          </select>
          <select
            value={draft.role}
            onChange={(event) => setDraft((value) => ({ ...value, role: event.target.value as FounderTask['role'] }))}
            style={fieldStyle}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={draft.deadline}
            onChange={(event) => setDraft((value) => ({ ...value, deadline: event.target.value }))}
            style={fieldStyle}
          />
          <button onClick={addNewTask} style={primaryButtonStyle}>
            <Plus size={15} />
            Add task
          </button>
        </section>

        <div
          ref={boardRef}
          style={boardStyle}
          onWheel={(event) => {
            event.preventDefault();
            setZoom((value) => Math.max(0.55, Math.min(1.7, value + (event.deltaY < 0 ? 0.08 : -0.08))));
          }}
        >
          <div style={{ ...zoomLayerStyle, transform: `scale(${zoom})` }}>
          <svg style={connectionLayerStyle}>
            {selectedVenture && (
              <g>
                {displayedTasks
                  .filter((task) => task.ventureId === selectedVenture.id)
                  .map((task) => {
                    const x1 = 225;
                    const y1 = 100;
                    const x2 = task.position.x;
                    const y2 = task.position.y + 64;
                    const mid = (x1 + x2) / 2;
                    return (
                      <path
                        key={`venture-${task.id}`}
                        d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                        stroke={colors.border.default}
                        strokeWidth="1.2"
                        fill="none"
                      />
                    );
                  })}
              </g>
            )}
            {visibleConnections.map((connection) => {
              const fromTask = displayedTaskMap.get(connection.fromTaskId);
              const toTask = displayedTaskMap.get(connection.toTaskId);
              if (!fromTask || !toTask) return null;
              const x1 = fromTask.position.x + 242;
              const y1 = fromTask.position.y + 64;
              const x2 = toTask.position.x;
              const y2 = toTask.position.y + 64;
              const mid = (x1 + x2) / 2;

              return (
                <g key={connection.id}>
                  <path
                    d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                    stroke={colors.border.strong}
                    strokeWidth="1.4"
                    fill="none"
                    strokeDasharray="5 7"
                  />
                  <circle cx={x2} cy={y2} r="3.5" fill={colors.text.secondary} />
                </g>
              );
            })}
          </svg>

          {selectedVenture && (
            <div style={ventureAnchorStyle(selectedVenture.color)}>
              <div style={eyebrowStyle}>Selected venture</div>
              <strong>{selectedVenture.name}</strong>
              <span>{displayedTasks.length} linked {displayedTasks.length === 1 ? 'task' : 'tasks'}</span>
            </div>
          )}

          {visibleConnections.map((connection) => {
            const fromTask = displayedTaskMap.get(connection.fromTaskId);
            const toTask = displayedTaskMap.get(connection.toTaskId);
            if (!fromTask || !toTask) return null;
            return (
              <button
                key={connection.id}
                onClick={() => deleteTaskConnection(connection.id)}
                style={{
                  ...connectionButtonStyle,
                  left: (fromTask.position.x + toTask.position.x) / 2 + 95,
                  top: (fromTask.position.y + toTask.position.y) / 2 + 50,
                }}
                aria-label="Delete task connection"
              >
                <X size={10} />
              </button>
            );
          })}

          {displayedTasks.map((task) => {
            const venture = ventures.find((item) => item.id === task.ventureId);
            const isLinking = linkStartId === task.id;
            return (
              <div
                key={task.id}
                onPointerDown={(event) => beginDrag(task.id, event)}
                style={{
                  ...taskCardStyle,
                  left: task.position.x,
                  top: task.position.y,
                  borderColor: isLinking ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.1)',
                  transform: draggingId === task.id ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={ventureMarkStyle(venture?.color, venture?.logoUrl)}>{!venture?.logoUrl && (venture?.name.slice(0, 1) || 'T')}</span>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleLinkClick(task.id)} style={tinyButtonStyle} aria-label="Connect task">
                      <Link2 size={12} />
                    </button>
                    <button onClick={() => {
                      deleteTask(task.id);
                      deleteTaskFromDb(task.id).catch(console.error);
                    }} style={tinyButtonStyle} aria-label="Delete task">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div style={taskTitleStyle}>{task.title}</div>
                <div style={taskMetaStyle}>
                  <span><UserRound size={11} /> {task.role}</span>
                  <span><CalendarDays size={11} /> {formatDate(task.deadline)}</span>
                </div>
                <textarea
                  value={task.notes}
                  onChange={(event) => updateTask(task.id, { notes: event.target.value })}
                  placeholder="Notes"
                  rows={2}
                  style={notesStyle}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <select
                    value={task.status}
                    onChange={(event) => updateTask(task.id, { status: event.target.value as FounderTask['status'] })}
                    style={statusSelectStyle(task.status)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <span style={ventureLabelStyle}>
                    {venture?.name || 'No venture'}
                    <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            );
          })}

          {displayedTasks.length === 0 && (
            <div style={emptyStateStyle}>
              <Circle size={32} strokeWidth={1.2} />
              <span>{selectedVenture ? `Create the first task for ${selectedVenture.name}.` : 'Create the first task to start mapping your founder board.'}</span>
            </div>
          )}

          {linkStartId && (
            <div style={linkHintStyle}>
              <Check size={13} />
              Pick another task to connect it.
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 260,
  background: colors.background.base,
  padding: `${layout.header.height}px 0 0`,
  fontFamily: typography.family.base,
};

const shellStyle: React.CSSProperties = {
  height: '100%',
  background: `linear-gradient(180deg, ${colors.background.surface}, ${colors.background.base})`,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  minHeight: '76px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing['2xl'],
  padding: `${spacing.lg} ${spacing.lg + 6}px`,
  borderBottom: `1px solid ${colors.border.default}`,
};

const eyebrowStyle: React.CSSProperties = {
  color: colors.text.secondary,
  fontSize: typography.size.xs,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
};

const titleStyle: React.CSSProperties = {
  margin: `${spacing.xs + 1}px 0 0`,
  color: colors.text.primary,
  fontFamily: typography.family.display,
  fontSize: typography.size.xl,
  fontWeight: typography.weight.bold,
  letterSpacing: 0,
};

const metricPillStyle: React.CSSProperties = {
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.full,
  padding: `${spacing.xs - 1}px ${spacing.xs + 2}px`,
  color: colors.text.secondary,
  fontSize: typography.size.xs,
  textTransform: 'uppercase',
  display: 'flex',
  gap: spacing.xs - 1,
};

const composerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  padding: `${spacing.md} ${spacing.lg}px`,
  borderBottom: `1px solid ${colors.border.subtle}`,
  background: colors.background.surface,
};

const boardStyle: React.CSSProperties = {
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: `radial-gradient(circle at 1px 1px, ${colors.border.subtle} 1px, transparent 0)`,
  backgroundSize: '28px 28px',
};

const zoomLayerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  transformOrigin: '0 0',
};

const ventureAnchorStyle = (color?: string): React.CSSProperties => ({
  position: 'absolute',
  left: '68px',
  top: '50px',
  width: '210px',
  minHeight: '100px',
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.lg,
  background: colors.background.elevated,
  boxShadow: color ? `0 0 38px ${color}22` : shadows.elevated,
  padding: spacing.lg,
  color: colors.text.primary,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs + 2,
});

const connectionLayerStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
};

const fieldStyle: React.CSSProperties = {
  height: `${components.input.heightSmall}px`,
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.md,
  background: colors.background.surface,
  color: colors.text.primary,
  padding: `0 ${components.input.paddingX}px`,
  outline: 'none',
  fontSize: typography.size.sm,
};

const primaryButtonStyle: React.CSSProperties = {
  ...fieldStyle,
  borderColor: colors.text.primary,
  color: colors.background.base,
  background: colors.text.primary,
  fontWeight: typography.weight.bold,
  textTransform: 'uppercase',
  display: 'flex',
  alignItems: 'center',
  gap: spacing.xs - 1,
  cursor: 'pointer',
};

const iconButtonStyle: React.CSSProperties = {
  width: `${components.button.icon.md.size}px`,
  height: `${components.button.icon.md.size}px`,
  borderRadius: '50%',
  border: `1px solid ${colors.border.default}`,
  background: colors.background.surface,
  color: colors.text.secondary,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const taskCardStyle: React.CSSProperties = {
  position: 'absolute',
  width: '242px',
  minHeight: '132px',
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.lg,
  background: colors.background.elevated,
  boxShadow: shadows.card,
  padding: spacing.md,
  cursor: 'grab',
  transition: `border-color ${transitions.default}, transform ${transitions.default}`,
};

const taskTitleStyle: React.CSSProperties = {
  marginTop: spacing.sm,
  color: colors.text.primary,
  fontFamily: typography.family.display,
  fontWeight: typography.weight.bold,
  fontSize: typography.size.md,
  lineHeight: 1.25,
};

const taskMetaStyle: React.CSSProperties = {
  marginTop: spacing.sm,
  display: 'flex',
  gap: spacing.md,
  color: colors.text.secondary,
  fontSize: typography.size.xs,
  textTransform: 'uppercase',
};

const notesStyle: React.CSSProperties = {
  width: '100%',
  marginTop: spacing.sm,
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.md,
  background: colors.background.surface,
  color: colors.text.primary,
  resize: 'none',
  padding: spacing.xs,
  outline: 'none',
  fontSize: typography.size.xs,
  lineHeight: 1.4,
  fontFamily: typography.family.base,
};

const tinyButtonStyle: React.CSSProperties = {
  width: '25px',
  height: '25px',
  borderRadius: radius.md,
  border: `1px solid ${colors.border.default}`,
  background: colors.background.surface,
  color: colors.text.secondary,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const connectionButtonStyle: React.CSSProperties = {
  position: 'absolute',
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  border: `1px solid ${colors.border.default}`,
  background: colors.background.base,
  color: colors.text.secondary,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
};

const ventureMarkStyle = (color?: string, logoUrl?: string): React.CSSProperties => ({
  width: '30px',
  height: '30px',
  borderRadius: radius.md,
  display: 'grid',
  placeItems: 'center',
  color: colors.background.base,
  fontFamily: typography.family.base,
  fontWeight: typography.weight.bold,
  background: logoUrl ? `center / cover no-repeat url(${logoUrl})` : color ? `linear-gradient(145deg, ${color}, rgba(255,255,255,0.9))` : colors.text.primary,
});

const ventureLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.xs - 1,
  color: colors.text.secondary,
  fontSize: typography.size.xs,
  maxWidth: '116px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const statusSelectStyle = (status: FounderTask['status']): React.CSSProperties => {
  const color: Record<FounderTask['status'], string> = {
    todo: colors.text.secondary,
    doing: colors.accent.teal,
    blocked: colors.status.failed,
    done: colors.status.active,
  };

  return {
    border: `1px solid ${color[status]}`,
    borderRadius: radius.full,
    background: 'transparent',
    color: color[status],
    padding: `${spacing.xs - 1}px ${spacing.xs + 1}px`,
    fontSize: typography.size.xs,
    textTransform: 'uppercase',
    outline: 'none',
    fontFamily: typography.family.base,
  };
};

const emptyStateStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'grid',
  placeItems: 'center',
  color: colors.text.tertiary,
  fontSize: typography.size.base,
  gap: spacing.lg,
};

const linkHintStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  bottom: `${spacing.lg}px`,
  transform: 'translateX(-50%)',
  border: `1px solid ${colors.border.default}`,
  borderRadius: radius.full,
  background: colors.background.base,
  color: colors.text.primary,
  padding: `${spacing.xs}px ${spacing.md}px`,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.xs - 1,
  fontSize: typography.size.xs,
};
