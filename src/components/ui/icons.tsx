import type React from "react"
import {
  // Navigation & UI
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HamburgerMenuIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  // Status & Actions
  CheckIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  ReloadIcon,
  UpdateIcon,
  DownloadIcon,
  UploadIcon,
  Share1Icon,
  CopyIcon,
  // User & Profile
  PersonIcon,
  AvatarIcon,
  GearIcon,
  ExitIcon,
  LockClosedIcon,
  LockOpen1Icon,
  EyeOpenIcon,
  EyeNoneIcon,
  // Communication
  EnvelopeClosedIcon,
  EnvelopeOpenIcon,
  ChatBubbleIcon,
  BellIcon,
  // Files & Documents
  FileIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  ArchiveIcon,
  // Time & Calendar
  CalendarIcon,
  ClockIcon,
  TimerIcon,
  StopwatchIcon,
  // Location & Maps
  GlobeIcon,
  HomeIcon,
  TargetIcon,
  // Agriculture Specific
  SunIcon,
  MoonIcon,
  CodeIcon,
  // Data & Analytics
  BarChartIcon,
  PieChartIcon,
  ActivityLogIcon,
  // Editing & Tools
  Pencil1Icon,
  Pencil2Icon,
  TrashIcon,
  ScissorsIcon,
  // Layout & Design
  RowsIcon,
  ColumnsIcon,
  GridIcon,
  StackIcon,
  // Arrows & Directions
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightIcon,
  ArrowBottomLeftIcon,
  // Media Controls
  PlayIcon,
  PauseIcon,
  StopIcon,
  TrackNextIcon,
  TrackPreviousIcon,
  // Social & External
  GitHubLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon,
  InstagramLogoIcon,
  // Miscellaneous
  StarIcon,
  StarFilledIcon,
  HeartIcon,
  HeartFilledIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  FaceIcon,
  RocketIcon,
  LightningBoltIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons"

// Export all icons for easy importing
export {
  // Navigation & UI
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HamburgerMenuIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
  MinusIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  // Status & Actions
  CheckIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  ReloadIcon,
  UpdateIcon,
  DownloadIcon,
  UploadIcon,
  Share1Icon,
  CopyIcon,
  // User & Profile
  PersonIcon,
  AvatarIcon,
  GearIcon,
  ExitIcon,
  LockClosedIcon,
  LockOpen1Icon,
  EyeOpenIcon,
  EyeNoneIcon,
  // Communication
  EnvelopeClosedIcon,
  EnvelopeOpenIcon,
  ChatBubbleIcon,
  BellIcon,
  // Files & Documents
  FileIcon,
  FileTextIcon,
  ImageIcon,
  VideoIcon,
  ArchiveIcon,
  // Time & Calendar
  CalendarIcon,
  ClockIcon,
  TimerIcon,
  StopwatchIcon,
  // Location & Maps
  GlobeIcon,
  HomeIcon,
  TargetIcon,
  // Agriculture Specific
  SunIcon,
  MoonIcon,
  // Data & Analytics
  BarChartIcon,
  PieChartIcon,
  ActivityLogIcon,
  // Editing & Tools
  Pencil1Icon,
  Pencil2Icon,
  TrashIcon,
  ScissorsIcon,
  // Layout & Design
  RowsIcon,
  ColumnsIcon,
  GridIcon,
  StackIcon,
  // Arrows & Directions
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopRightIcon,
  ArrowBottomLeftIcon,
  // Media Controls
  PlayIcon,
  PauseIcon,
  StopIcon,
  TrackNextIcon,
  TrackPreviousIcon,
  // Social & External
  GitHubLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon,
  InstagramLogoIcon,
  // Miscellaneous
  StarIcon,
  StarFilledIcon,
  HeartIcon,
  HeartFilledIcon,
  BookmarkIcon,
  BookmarkFilledIcon,
  FaceIcon,
  RocketIcon,
  LightningBoltIcon,
  MagicWandIcon,
}

// Custom icon wrapper component for consistent styling
export function Icon({
  children,
  className = "h-4 w-4",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode
}) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  )
}

// Predefined icon sets for common use cases
export const NavigationIcons = {
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  ChevronLeft: ChevronLeftIcon,
  ChevronRight: ChevronRightIcon,
  Menu: HamburgerMenuIcon,
  Close: Cross2Icon,
  Search: MagnifyingGlassIcon,
}

export const ActionIcons = {
  Add: PlusIcon,
  Remove: MinusIcon,
  Edit: Pencil1Icon,
  Delete: TrashIcon,
  Save: CheckIcon,
  Cancel: Cross2Icon,
  More: DotsHorizontalIcon,
}

export const StatusIcons = {
  Success: CheckIcon,
  Error: CrossCircledIcon,
  Warning: ExclamationTriangleIcon,
  Info: InfoCircledIcon,
  Loading: ReloadIcon,
}

export const UserIcons = {
  Profile: PersonIcon,
  Avatar: AvatarIcon,
  Settings: GearIcon,
  Logout: ExitIcon,
  Lock: LockClosedIcon,
  Unlock: LockOpen1Icon,
}

export const AgricultureIcons = {
  Sun: SunIcon,
  Moon: MoonIcon,
  Cloud: CodeIcon,
  Home: HomeIcon,
  Location: TargetIcon,
}
