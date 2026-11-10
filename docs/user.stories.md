# User Stories

## Overview
This document contains the user stories and requirement traceability for the Fabric application.

## Requirement Traceability Matrix (RTM)

| User Story | Bounded Context | Implemented Elements |
|:--|:--|:--|
| **US-001: Select User Role** | Identity & Access | `role-selection`, `useSessionStore`, `USER_ROLES` |
| **US-002: Role-Based Route Protection** | Identity & Access | `authGuard`, `withRole`, `useSessionStore`, `router` |
| **US-003: Role-Based Sidebar Navigation** | Identity & Access | `app-sidebar`, `layout`, `role-navigation` |
| **US-004: Switch Language** | Shared | `language-switcher`, `layout`, `i18n` |
| **US-005: View Page Not Found** | Shared | `page-not-found`, `router` |
| **US-006: View List of Machines** | Machine Registration | `machine-list`, `useMachineStore`, `MachineApi`, `MachineAssembler`, `Machine` |
| **US-007: Register a New Machine** | Machine Registration | `machine-form`, `useMachineStore`, `MachineApi`, `MachineAssembler`, `Machine` |
| **US-008: View Machine Details** | Machine Registration | `machine-detail`, `useMachineStore`, `MachineApi`, `MachineAssembler`, `Machine`, `StopEvent`, `MaintenanceRecord` |
| **US-009: Report a Machine Breakdown** | Machine Registration | `machine-breakdown`, `StopEvent`, `useMachineStore`, `MachineApi`, `MachineAssembler`, `Machine` |
| **US-010: Register Machine Maintenance** | Machine Registration | `machine-maintenance-form`, `MaintenanceRecord`, `useMachineStore`, `MachineApi`, `MachineAssembler`, `Machine` |
| **US-011: Resume Machine Operation** | Machine Registration | `machine-resume-form`, `StopEvent`, `useMachineStore`, `MachineApi`, `MachineAssembler`, `Machine` |
| **US-012: Delete a Machine** | Machine Registration | `machine-list`, `useMachineStore`, `MachineApi`, `MachineAssembler`, `Machine` |
| **US-013: View and Filter Production Batches** | Production Batches | `production-batches-list.view`, `batch-filters.component`, `batch-list-table.component`, `useProductionStore`, `ProductionBatchesApiService`, `ProductionBatch` |
| **US-014: Create a Production Batch** | Production Batches | `create-production-batch.view`, `create-batch-form.component`, `useProductionStore`, `ProductionBatchesApiService`, `ProductionBatch` |
| **US-015: View Batch Details** | Production Batches | `batch-detail.view`, `batch-info-card.component`, `stage-progress-stepper.component`, `BatchStage`, `useProductionStore`, `ProductionBatchesApiService`, `ProductionBatch` |
| **US-016: Update Batch Stage** | Production Batches | `update-stage-form.component`, `BatchMovement`, `useProductionStore`, `ProductionBatchesApiService`, `ProductionBatch` |
| **US-017: Assign Operators to a Batch** | Production Batches | `batch-operator-assignment.view`, `assign-operator-form.component`, `assigned-operators-table.component`, `BatchOperator`, `useProductionStore`, `ProductionBatchesApiService`, `ProductionBatch` |
| **US-018: Register Batch Observations** | Production Batches | `batch-observations.view`, `batch-observations-timeline.component`, `BatchObservation`, `useProductionStore`, `ProductionBatchesApiService`, `ProductionBatch` |
| **US-019: View Traceability History** | Production Batches | `traceability-history.view`, `movement-history-table.component`, `traceability-summary-card.component`, `BatchMovement`, `useProductionStore`, `ProductionBatchesApiService`, `ProductionBatch` |
| **US-020: View System Alerts** | Alerts | `alerts.vue`, `Alerts`, `AlertsApiService`, `Alert` |
| **US-021: View Production Dashboard** | Report Analytics | `report-analytics`, `StatCard`, `BatchesStage`, `BatchProgress`, `ProductionChart`, `ReportAnalyticsApiService`, `DashboardMetrics` |
| **US-022: Export Production Report** | Report Analytics | `ExportReportModal`, `report-analytics` |
| **US-023: View Fabric Inspections** | Quality | `quality.vue`, `fabricInspections`, `FabricInspectionService` |
| **US-024: Register Garment Defect** | Quality | `quality.vue`, `RegisterDefectForm`, `DefectService`, `DefectRecord` |
| **US-025: View Observed Garments** | Quality | `ObservedGarmentsTable`, `DefectService`, `DefectRecord` |
| **US-026: Define Defect Disposition** | Quality | `DefectDispositionCard`, `DefectService`, `DefectRecord` |
| **US-027: Add Defect Evidence** | Quality | `AddEvidenceView`, `DefectService`, `DefectRecord` |
| **US-028: Register Fabric Inspection (Supervisor)** | Quality | `NewFabricInspectionView`, `FabricInspectionService` |
| **US-029: Register Shrinkage Test (Supervisor)** | Quality | `ShrinkageTestView`, `FabricInspectionService` |
| **US-030: Register Inspection Parameters (Supervisor)** | Quality | `InspectionParametersView`, `FabricInspectionService` |
| **US-031: View Inspector Dashboard** | Quality (Inspector) | `inspector-dashboard.view`, `inspection-chart.component`, `useInspectorDashboardStore`, `summarizeInspections`, `FabricInspectionService` |
| **US-032: Filter Inspection History** | Quality (Inspector) | `inspection-history.component`, `filterInspections`, `sortByDateDescending` |
| **US-033: Register New Roll Inspection** | Quality (Inspector) | `new-roll-inspection.view`, `new-roll-inspection-form.component`, `useFabricInspectionStore`, `FabricInspection`, `FabricCatalogService` |
| **US-034: Register Inspection Parameters** | Quality (Inspector) | `inspection-parameters.view`, `inspection-parameters-form.component`, `useInspectionParametersStore`, `InspectionParameters` |
| **US-035: Register Shrinkage Test** | Quality (Inspector) | `shrinkage-test.view`, `shrinkage-test-form.component`, `useShrinkageTestStore`, `ShrinkageTest` |

## US-001: Select User Role

**Description:** As an user, I want to select my role when entering the application so that I can access the tools that correspond to my work.

### Acceptance Criteria

#### Scenario 1: Selecting the production supervisor role
Given the user is on the role selection screen  
When the user selects the production supervisor role,
Then the system starts the session and redirects to the dashboard

#### Scenario 2: Selecting the quality inspector role
Given the user is on the role selection screen  
When the user selects the quality inspector role,
Then the system starts the session and redirects to the inspector dashboard

## US-002: Role-Based Route Protection

**Description:** As a system administrator, I want to restrict each route to the role that owns it so that users cannot open screens that belong to another role.

### Acceptance Criteria

#### Scenario 1: Accessing without a session
Given no role has been selected  
When the user opens a protected route,
Then the system redirects to the role selection screen

#### Scenario 2: Accessing a route of another role
Given the user has an active session with one role  
When the user opens a route that belongs to the other role,
Then the system redirects the user to the home screen of their own role

#### Scenario 3: Opening role selection with an active session
Given the user already has an active session  
When the user opens the role selection screen,
Then the system redirects the user to the home screen of their role

## US-003: Role-Based Sidebar Navigation

**Description:** As an user, I want to see in the sidebar only the options of my role so that I can navigate quickly to my tasks.

### Acceptance Criteria

#### Scenario 1: Sidebar of the production supervisor
Given the user has the production supervisor role  
When the layout is displayed,
Then the sidebar shows dashboard, batches, machinery, alerts and quality

#### Scenario 2: Sidebar of the quality inspector
Given the user has the quality inspector role  
When the layout is displayed,
Then the sidebar shows dashboard, new roll inspection, parameters and shrinkage test

## US-004: Switch Language

**Description:** As an user, I want to switch the interface between English and Spanish so that I can use the application in my preferred language.

### Acceptance Criteria

#### Scenario 1: Switching to an available language
Given the application is displayed in one language  
When the user selects the other language,
Then all labels, headers, placeholders and messages change immediately

#### Scenario 2: Stored values remain unchanged
Given the user has switched the language  
When the system shows statuses such as Conforming or Blocked,
Then the statuses are translated for display while the stored values stay the same

## US-005: View Page Not Found

**Description:** As an user, I want to see a not found page when I open an unknown address so that I understand the page does not exist and can go back.

### Acceptance Criteria

#### Scenario 1: Opening an unknown route
Given the user types an address that does not exist  
When the router cannot match the route,
Then the system displays the page not found view

## US-006: View List of Machines

**Description:** As a production supervisor, I want to view the list of registered machines with their status so that I can monitor the state of the machinery.

### Acceptance Criteria

#### Scenario 1: Viewing machines when machines exist
Given there are machines registered  
When the supervisor opens the machinery screen,
Then the system shows each machine with its type, assigned batch and status

#### Scenario 2: Viewing machines when none exist
Given there are no machines registered  
When the supervisor opens the machinery screen,
Then the system shows an empty list

## US-007: Register a New Machine

**Description:** As a production supervisor, I want to register a new machine so that it can be tracked in production.

### Acceptance Criteria

#### Scenario 1: Registering a machine with valid data
Given the supervisor provides the machine type and batch  
When the supervisor submits the form,
Then the system creates the machine with an identifier and an operational status and confirms the creation

#### Scenario 2: Registering a machine with missing data
Given a required field is empty  
When the supervisor submits the form,
Then the system rejects the registration and shows an error message

## US-008: View Machine Details

**Description:** As a production supervisor, I want to view the details of a machine with its stop events and maintenance records so that I can analyze its downtime and maintenance history.

### Acceptance Criteria

#### Scenario 1: Viewing the details of an existing machine
Given a machine exists  
When the supervisor opens its details,
Then the system shows its data, stop events and maintenance records

#### Scenario 2: Viewing a machine without history
Given a machine has no stop events or maintenance records  
When the supervisor opens its details,
Then the system shows empty history sections

## US-009: Report a Machine Breakdown

**Description:** As a production supervisor, I want to report a breakdown of a machine with its category and description so that the stop is recorded and the machine is marked as stopped.

### Acceptance Criteria

#### Scenario 1: Reporting a breakdown with valid data
Given an operational machine exists  
When the supervisor submits the failure category, description and stop time,
Then the system creates a stop event and changes the machine status to stopped

#### Scenario 2: Reporting a breakdown with missing data
Given the failure category is empty  
When the supervisor submits the report,
Then the system rejects it and shows an error message

## US-010: Register Machine Maintenance

**Description:** As a production supervisor, I want to register a maintenance intervention on a machine so that its maintenance history stays up to date.

### Acceptance Criteria

#### Scenario 1: Registering maintenance with valid data
Given a machine exists  
When the supervisor submits the date, type, intervention, parts replaced and technician,
Then the system creates the maintenance record and shows it in the history

#### Scenario 2: Registering maintenance with missing data
Given a required field is empty  
When the supervisor submits the form,
Then the system rejects it and shows an error message

## US-011: Resume Machine Operation

**Description:** As a production supervisor, I want to resume the operation of a stopped machine so that its downtime is calculated and it returns to operational status.

### Acceptance Criteria

#### Scenario 1: Resuming a stopped machine
Given a machine is stopped  
When the supervisor submits the resume time,
Then the system closes the stop event with its duration and changes the machine status to operational

## US-012: Delete a Machine

**Description:** As a production supervisor, I want to delete a machine that is no longer used so that the machine list only contains active machinery.

### Acceptance Criteria

#### Scenario 1: Deleting an existing machine
Given a machine exists  
When the supervisor confirms the deletion,
Then the system removes the machine from the list

#### Scenario 2: Cancelling the deletion
Given a machine exists  
When the supervisor cancels the confirmation,
Then the system keeps the machine

## US-013: View and Filter Production Batches

**Description:** As a production supervisor, I want to view the list of production batches and filter them so that I can find a batch quickly.

### Acceptance Criteria

#### Scenario 1: Viewing batches when batches exist
Given there are production batches  
When the supervisor opens the batches screen,
Then the system shows each batch with its model, quantity, stage, progress and status

#### Scenario 2: Filtering batches
Given there are production batches  
When the supervisor applies a filter,
Then the system shows only the batches that match the filter

#### Scenario 3: Viewing batches when none exist
Given there are no production batches  
When the supervisor opens the batches screen,
Then the system shows an empty list

## US-014: Create a Production Batch

**Description:** As a production supervisor, I want to create a new production batch so that its production can be tracked from the first stage.

### Acceptance Criteria

#### Scenario 1: Creating a batch with valid data
Given the supervisor provides garment model, projected quantity and delivery date  
When the supervisor submits the form,
Then the system creates the batch and confirms the creation

#### Scenario 2: Creating a batch with invalid data
Given a required field is empty or invalid  
When the supervisor submits the form,
Then the system rejects the creation and shows an error message

## US-015: View Batch Details

**Description:** As a production supervisor, I want to view the details of a batch and its progress by stage so that I know exactly where the batch is in the process.

### Acceptance Criteria

#### Scenario 1: Viewing an existing batch
Given a batch exists  
When the supervisor opens the batch details,
Then the system shows its data and the progress of each stage

#### Scenario 2: Viewing a non-existent batch
Given the batch does not exist  
When the supervisor opens its address,
Then the system shows an error message

## US-016: Update Batch Stage

**Description:** As a production supervisor, I want to register the quantity processed in a stage and move the batch forward so that the progress and the traceability are updated.

### Acceptance Criteria

#### Scenario 1: Updating a stage with valid quantities
Given a batch is in a stage  
When the supervisor submits quantity in, quantity out and the person responsible,
Then the system records the movement and updates the progress of the batch

#### Scenario 2: Detecting a discrepancy
Given the quantity out is lower than the quantity in  
When the supervisor submits the update,
Then the system records the movement marked with a difference

## US-017: Assign Operators to a Batch

**Description:** As a production supervisor, I want to assign operators to a batch and stage so that responsibilities are clear in each stage.

### Acceptance Criteria

#### Scenario 1: Assigning an operator
Given a batch and available operators exist  
When the supervisor selects an operator and a stage and submits,
Then the system registers the assignment and shows it in the assigned operators table

#### Scenario 2: Viewing assigned operators
Given a batch has assigned operators  
When the supervisor opens the assignment screen,
Then the system lists the operators with their specialty, stage and assignment date

## US-018: Register Batch Observations

**Description:** As a production supervisor, I want to register observations about a batch so that incidents and comments remain documented.

### Acceptance Criteria

#### Scenario 1: Adding an observation
Given a batch exists  
When the supervisor writes an observation and submits it,
Then the system adds it to the timeline with its author and date

#### Scenario 2: Adding an empty observation
Given the observation text is empty  
When the supervisor submits it,
Then the system rejects it

## US-019: View Traceability History

**Description:** As a production supervisor, I want to view the movement history of a batch by stage so that I can trace what happened to it and who handled it.

### Acceptance Criteria

#### Scenario 1: Viewing the history of a batch
Given a batch has recorded movements  
When the supervisor opens the traceability history,
Then the system shows each movement with stage, quantities, difference, person responsible and date

## US-020: View System Alerts

**Description:** As a production supervisor, I want to view the system alerts about machines and batches so that I can react quickly to problems.

### Acceptance Criteria

#### Scenario 1: Viewing alerts when alerts exist
Given there are active alerts  
When the supervisor opens the alerts screen,
Then the system shows each alert with its type, status, description and recommended action

#### Scenario 2: Viewing alerts when none exist
Given there are no alerts  
When the supervisor opens the alerts screen,
Then the system shows an empty list

## US-021: View Production Dashboard

**Description:** As a production supervisor, I want to view a dashboard with production indicators and charts so that I can evaluate the performance of the plant.

### Acceptance Criteria

#### Scenario 1: Viewing the dashboard
Given there is production data  
When the supervisor opens the dashboard,
Then the system shows total produced, average per hour, compliance, batches by stage and the production chart

#### Scenario 2: Viewing the dashboard of another date
Given there is data for several dates  
When the supervisor selects a date,
Then the system updates the indicators for that date

## US-022: Export Production Report

**Description:** As a production supervisor, I want to export the production report so that I can share the results with other people.

### Acceptance Criteria

#### Scenario 1: Exporting a report
Given the dashboard is displayed  
When the supervisor opens the export window and confirms,
Then the system generates the report

## US-023: View Fabric Inspections

**Description:** As a production supervisor, I want to view the fabric roll inspections with statistics, filters and statuses so that I know which rolls are available for cutting.

### Acceptance Criteria

#### Scenario 1: Viewing inspections
Given there are fabric inspections  
When the supervisor opens the Fabrics tab,
Then the system shows the totals and a table with result, shrinkage test and roll status

#### Scenario 2: Filtering inspections
Given there are fabric inspections  
When the supervisor filters by roll, supplier, result or date,
Then the system shows only the matching inspections

#### Scenario 3: Viewing inspections when none exist
Given there are no inspections  
When the supervisor opens the Fabrics tab,
Then the system shows a message that no inspections were found

## US-024: Register Garment Defect

**Description:** As a production supervisor, I want to register a defect found in garments so that the defect is documented with its origin and quantity.

### Acceptance Criteria

#### Scenario 1: Registering a defect with valid data
Given the supervisor provides batch, defect type, quantity, machine and origin  
When the supervisor submits the form,
Then the system creates the defect record and confirms the registration

#### Scenario 2: Registering a defect with invalid data
Given a required field is empty or the quantity is invalid  
When the supervisor submits the form,
Then the system rejects the registration and shows an error message

## US-025: View Observed Garments

**Description:** As a production supervisor, I want to view the observed garments grouped and with their recurrence so that I can detect recurring defects.

### Acceptance Criteria

#### Scenario 1: Viewing observed garments
Given there are defect records  
When the supervisor opens the Defects tab,
Then the system shows the records with their status and recurrence

#### Scenario 2: Viewing observed garments when none exist
Given there are no defect records  
When the supervisor opens the Defects tab,
Then the system shows an empty table

## US-026: Define Defect Disposition

**Description:** As a production supervisor, I want to decide whether the defective garments are reworked or discarded so that their final destination is documented.

### Acceptance Criteria

#### Scenario 1: Sending garments to rework
Given a defect record is pending  
When the supervisor selects rework with a correction type and quantity,
Then the system saves the disposition and updates the status of the record

#### Scenario 2: Discarding garments
Given a defect record is pending  
When the supervisor selects discard,
Then the system saves the disposition and updates the status of the record

## US-027: Add Defect Evidence

**Description:** As a production supervisor, I want to add evidence to a defect record so that the defect is supported with images and notes.

### Acceptance Criteria

#### Scenario 1: Adding evidence
Given a defect record exists  
When the supervisor uploads an image and a note and submits,
Then the system saves the evidence in the record

#### Scenario 2: Failing to save evidence
Given the evidence could not be saved  
When the supervisor submits it,
Then the system shows an error message

## US-028: Register Fabric Inspection (Supervisor)

**Description:** As a production supervisor, I want to register an inspection of a fabric roll so that the roll is classified as available or blocked.

### Acceptance Criteria

#### Scenario 1: Registering a conforming roll
Given the supervisor fills in the roll data and selects Conforming  
When the supervisor saves,
Then the system registers the roll as available for cutting

#### Scenario 2: Registering an observed roll
Given the supervisor selects Observed  
When the supervisor saves,
Then the system registers the roll as blocked

## US-029: Register Shrinkage Test (Supervisor)

**Description:** As a production supervisor, I want to register the shrinkage test of a roll so that its dimensional stability is documented.

### Acceptance Criteria

#### Scenario 1: Registering a test
Given a roll exists  
When the supervisor enters the initial and final measurements and a result,
Then the system calculates the shrinkage percentage, saves the test in the history and updates the roll

#### Scenario 2: Viewing the test history
Given the roll has tests  
When the supervisor opens the shrinkage test screen,
Then the system lists the previous tests

## US-030: Register Inspection Parameters (Supervisor)

**Description:** As a production supervisor, I want to register the physical and visual parameters of a roll so that the condition of the material at reception is documented.

### Acceptance Criteria

#### Scenario 1: Saving parameters
Given a roll exists  
When the supervisor enters width, weight, shade, weave and surface condition and saves,
Then the system stores the parameters and adds a record to the history

#### Scenario 2: Viewing the record history
Given the roll has parameter records  
When the supervisor opens the parameters screen,
Then the system lists the previous records

## US-031: View Inspector Dashboard

**Description:** As a quality inspector, I want to view a dashboard with the results of the inspections so that I can see the quality status of the received fabric.

### Acceptance Criteria

#### Scenario 1: Viewing the dashboard
Given there are fabric inspections  
When the inspector opens the dashboard,
Then the system shows totals, conforming and observed rolls, pending and approved tests and charts

#### Scenario 2: Viewing the dashboard without data
Given there are no inspections  
When the inspector opens the dashboard,
Then the system shows an empty data message

## US-032: Filter Inspection History

**Description:** As a quality inspector, I want to search and filter the inspection history so that I can find a specific roll.

### Acceptance Criteria

#### Scenario 1: Filtering by supplier, result or roll
Given there are inspections  
When the inspector applies a filter,
Then the system shows only the matching inspections sorted by date

#### Scenario 2: Filtering without matches
Given no inspection matches the filter  
When the inspector applies it,
Then the system shows an empty result message

## US-033: Register New Roll Inspection

**Description:** As a quality inspector, I want to register the initial inspection of a received fabric roll so that the roll is classified before cutting.

### Acceptance Criteria

#### Scenario 1: Registering with valid data
Given the inspector selects supplier and fabric sample and fills in the roll data  
When the inspector saves the inspection,
Then the system registers the roll with a pending shrinkage test and shows it in the history

#### Scenario 2: Registering with invalid data
Given a required field is empty or the result is Observed without an observation  
When the inspector saves,
Then the system rejects it and shows the validation error

#### Scenario 3: Clearing the form
Given the inspector has entered data  
When the inspector uses the clear button,
Then the system empties all the fields

## US-034: Register Inspection Parameters

**Description:** As a quality inspector, I want to register the measured parameters of an inspected roll so that the condition of the material is documented.

### Acceptance Criteria

#### Scenario 1: Saving valid parameters
Given an inspected roll is selected  
When the inspector enters width, length, shade condition and defects and saves,
Then the system stores the parameters and adds an entry to the roll history

#### Scenario 2: Saving invalid parameters
Given the width or length is missing or invalid  
When the inspector saves,
Then the system rejects it and shows the validation error

## US-035: Register Shrinkage Test

**Description:** As a quality inspector, I want to register the shrinkage test of a roll against the tolerance of its sample so that the roll is approved or marked as non-compliant.

### Acceptance Criteria

#### Scenario 1: Registering a test within tolerance
Given a roll with a fabric sample tolerance is selected  
When the inspector enters initial and final measurements,
Then the system calculates the shrinkage, marks the test as approved and updates the roll

#### Scenario 2: Registering a test outside tolerance
Given the calculated shrinkage exceeds the tolerance  
When the inspector saves the test,
Then the system marks the test as non-compliant
