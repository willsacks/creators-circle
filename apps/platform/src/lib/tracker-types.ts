export type TrackerType = 'album' | 'show' | 'book' | 'visual_art' | 'custom'

export interface TrackerTypeDefinition {
  id: TrackerType
  label: string
  description: string
  icon: string
  stages: string[]
  itemLabel: string
  itemPlaceholder: string
}

export const TRACKER_TYPES: TrackerTypeDefinition[] = [
  {
    id: 'album',
    label: 'Album / EP',
    description: 'Track songs through your production pipeline',
    icon: 'Music',
    stages: ['Idea', 'Demo', 'Arrangement', 'Tracking', 'Editing', 'Mixing', 'Mastering', 'Released'],
    itemLabel: 'song',
    itemPlaceholder: 'Song title...',
  },
  {
    id: 'show',
    label: 'Live Show / Event',
    description: 'Manage everything from concept to curtain call',
    icon: 'Ticket',
    stages: ['Concept', 'Booking', 'Promotion', 'Rehearsal', 'Tech', 'Show Night', 'Wrap'],
    itemLabel: 'task',
    itemPlaceholder: 'Task name...',
  },
  {
    id: 'book',
    label: 'Book / Writing',
    description: 'Move chapters from outline to final draft',
    icon: 'BookOpen',
    stages: ['Outline', 'Draft', 'Revised', 'Edited', 'Final', 'Published'],
    itemLabel: 'chapter',
    itemPlaceholder: 'Chapter title...',
  },
  {
    id: 'visual_art',
    label: 'Visual Art / Craft',
    description: 'Track a piece or collection from sketch to finished',
    icon: 'Palette',
    stages: ['Sketch', 'Composition', 'Underpainting', 'Detail', 'Finishing', 'Complete'],
    itemLabel: 'piece',
    itemPlaceholder: 'Piece name...',
  },
  {
    id: 'custom',
    label: 'Custom',
    description: 'Define your own stages for any kind of project',
    icon: 'Sliders',
    stages: ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Done'],
    itemLabel: 'item',
    itemPlaceholder: 'Item name...',
  },
]

export function getTrackerDef(trackerType: string, config: Record<string, unknown>): TrackerTypeDefinition {
  const def = TRACKER_TYPES.find((t) => t.id === trackerType)
  if (!def) return TRACKER_TYPES[TRACKER_TYPES.length - 1]
  if (trackerType === 'custom' && Array.isArray(config.stages) && config.stages.length > 0) {
    return { ...def, stages: config.stages as string[] }
  }
  return def
}
