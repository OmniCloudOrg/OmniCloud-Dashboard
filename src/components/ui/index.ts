// =============================================================================
// CONSOLIDATED UI COMPONENT LIBRARY
// =============================================================================
// This index file exports all consolidated UI components, replacing the 
// numerous duplicate implementations throughout the application.
//
// MIGRATION GUIDE:
// Replace imports from old component files with imports from this index:
// 
// OLD: import { Button } from '../some/path/button-components'
// NEW: import { Button } from '@/components/ui'
//
// OLD: import StatusBadge from '../path/StatusBadge'  
// NEW: import { StatusBadge } from '@/components/ui'
// =============================================================================

// Button Components
// -----------------
// Consolidated from: 
// - src/components/ui/Button.tsx
// - src/app/dash/components/ui/button-components.jsx
// - Multiple inline button implementations
export { default as Button, ButtonGroup, IconButton, ToggleButton } from './Button';

// Status Components  
// -----------------
// Consolidated from:
// - src/components/ui/StatusBadge.jsx
// - src/app/dash/components/ui/status-components.jsx
// - src/app/dash/alerts/components/SeverityBadge.jsx
// - Various inline status badge implementations
export { default as StatusBadge, LogLevelBadge, SeverityBadge } from './StatusBadge';

// Card Components
// ---------------
// Consolidated from:
// - src/components/ui/StatusCard.jsx
// - src/components/ui/ResourceCard.jsx
// - src/app/dash/components/ui/card-components.jsx
// - Multiple feature-specific card implementations
export { 
  default as Card, 
  DetailItem,
  ResourceCard, 
  StatusCard, 
  InstanceCard, 
  ApplicationCard, 
  StatsCard, 
  EmptyCard, 
  ExpandableCard 
} from './Card';

// Modal Components
// ----------------
// Enhanced version of existing modal system from:
// - src/app/dash/components/ui/modal-components.jsx
// - Multiple modal implementations across features
export { 
  default as Modal, 
  MultiStepProgress, 
  useConfirmModal 
} from './Modal';

// Search and List Components
// --------------------------
// Consolidated from:
// - src/components/Base/ListFilter.tsx
// - src/app/dash/components/ui/form-components.jsx (SearchInput)
// - src/app/dash/components/ui/layout-components.jsx (DataTable)
// - Multiple inline search and list implementations
export {
  SearchInput,
  FilterDropdown,
  DataTable,
  Pagination,
  default as SearchableDataTable
} from './SearchAndList';

// Form Components
// ---------------
// Consolidated form components with TypeScript support
export { 
  FormField, 
  FormGroup, 
  FilterSelect,
  ToggleSwitch 
} from './Form';

// Layout Components
// -----------------
// Consolidated layout components with TypeScript support
export {
  DashboardHeader,
  DashboardSection,
  DashboardLayout,
  DashboardGrid,
  TabNavigation,
  SearchFilter,
  EmptyState,
  StatusIndicator
} from './Layout';

// Chart Components
// ----------------
// Consolidated chart components with TypeScript support
export {
  AreaChartComponent,
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  ChartContainer,
  MetricsDisplay,
  ProgressBar
} from './Charts';

// =============================================================================
// COMPONENT USAGE EXAMPLES
// =============================================================================

/*
// Button Examples:
import { Button, IconButton, ButtonGroup } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Primary Button
</Button>

<IconButton icon={Settings} variant="transparent" onClick={handleSettings} />

<ButtonGroup>
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Submit</Button>
</ButtonGroup>

// Status Badge Examples:
import { StatusBadge, LogLevelBadge, SeverityBadge } from '@/components/ui';

<StatusBadge status="running" />
<LogLevelBadge level="error" />
<SeverityBadge severity="critical" />

// Card Examples:
import { Card, ResourceCard, StatsCard } from '@/components/ui';

<ResourceCard 
  title="CPU Usage" 
  value="75%" 
  icon={Cpu} 
  color="bg-blue-500/10" 
  trend="up" 
  percentage={12} 
/>

<Card type="generic" title="Settings" icon={Settings}>
  Card content here
</Card>

// Modal Examples:
import { Modal, useConfirmModal } from '@/components/ui';

<Modal 
  type="form" 
  isOpen={isOpen} 
  onClose={onClose} 
  title="Create Application"
  onSubmit={handleSubmit}
>
  Form content
</Modal>

const { openConfirmModal, ConfirmModal } = useConfirmModal();

// Search and Table Examples:
import { SearchableDataTable, SearchInput } from '@/components/ui';

<SearchableDataTable
  data={applications}
  columns={columns}
  searchKeys={['name', 'description']}
  filterConfigs={filterConfigs}
  onRowClick={handleRowClick}
/>

<SearchInput 
  value={searchQuery} 
  onChange={setSearchQuery} 
  placeholder="Search applications..." 
/>
*/

// =============================================================================
// MIGRATION STATUS
// =============================================================================
/*
✅ Button Components - Consolidated and enhanced
✅ Status Badge Components - Consolidated with all variants
✅ Card Components - Consolidated with all card types
✅ Modal Components - Enhanced with multiple modal types
✅ Search and List Components - Consolidated with full functionality
🔄 Form Components - Re-exported (already consolidated)
🔄 Layout Components - Re-exported (already consolidated) 
🔄 Chart Components - Re-exported (already consolidated)

ESTIMATED REDUCTION: 40-50% of component code
BENEFITS:
- Single source of truth for all UI components
- Consistent design system
- Easier maintenance and updates
- Better TypeScript support
- Improved developer experience
*/

import Button from './Button';
import StatusBadge from './StatusBadge';
import Card from './Card';
import Modal from './Modal';
import SearchableDataTable, { SearchInput } from './SearchAndList';

export default {
  // Export commonly used components as default for convenience
  Button,
  StatusBadge,
  Card,
  Modal,
  SearchableDataTable,
  SearchInput
};