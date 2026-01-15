export enum EquipmentState {
  Red = "Red",
  Yellow = "Yellow",
  Green = "Green"
}

export enum OrderStatus {
  Pending = "Pending",
  Scheduled = "Scheduled",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled"
}

export enum OrderPriority {
  Low = "Low",
  Normal = "Normal",
  High = "High",
  Critical = "Critical"
}

export interface Order {
  id: number;
  orderNumber: string;
  productName: string;
  quantityRequested: number;
  quantityProduced: number;
  createdAt: string;
  scheduledStartTime?: string;
  actualStartTime?: string;
  completedAt?: string;
  status: OrderStatus;
  priority: OrderPriority;
  assignedEquipmentId?: number;
  assignedEquipment?: Equipment;
}

export interface ScheduledOrder {
  id: number;
  equipmentId: number;
  orderId: number;
  sequenceNumber: number;
  scheduledStartTime: string;
  estimatedEndTime: string;
  equipment?: Equipment;
  order?: Order;
}

export interface Equipment {
  id: number;
  name: string;
  currentState: EquipmentState;
  currentOrderId?: number;
  currentOrder?: Order;
  scheduledOrders?: ScheduledOrder[];
}

export interface EquipmentStateChange {
  id: string;
  equipmentId: number;
  state: EquipmentState;
  timestamp: string;
  changedById: string;
}

export interface EquipmentStateChangedMessage {
  topic: string;
  equipmentId: number;
  equipmentName: string;
  state: EquipmentState;
  stateLabel: string;
  timestamp: string;
  changedById: string;
}



