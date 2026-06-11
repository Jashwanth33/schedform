# SchedForm

[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> A powerful form builder with scheduling capabilities for automating workflows and data collection.

## Architecture

`mermaid
graph TB
    subgraph "Frontend"
        React[React App]
        FormBuilder[Form Builder UI]
        Scheduler[Scheduler UI]
    end

    subgraph "Backend"
        API[Express API]
        Cron[Cron Service]
        Queue[Job Queue]
    end

    subgraph "Storage"
        MongoDB[(MongoDB)]
        Redis[(Redis)]
    end

    React --> FormBuilder
    React --> Scheduler
    FormBuilder --> API
    Scheduler --> API
    API --> MongoDB
    API --> Redis
    Cron --> Queue
    Queue --> API
`

## Form Builder Flow

`mermaid
flowchart TD
    Start[Create New Form] --> AddField[Add Form Field]
    AddField --> FieldType{Field Type}
    FieldType -->|Text| Text[Text Input]
    FieldType -->|Number| Number[Number Input]
    FieldType -->|Date| Date[Date Picker]
    FieldType -->|Select| Dropdown[Dropdown Menu]
    FieldType -->|File| Upload[File Upload]
    
    Text --> Configure[Configure Validation]
    Number --> Configure
    Date --> Configure
    Dropdown --> Configure
    Upload --> Configure
    
    Configure --> Preview[Preview Form]
    Preview --> Save[Save Form]
    Save --> Schedule{Schedule?}
    Schedule -->|Yes| SetTime[Set Schedule Time]
    Schedule -->|No| Publish[Publish Form]
    SetTime --> Cron[Create Cron Job]
    Cron --> Publish
`

## Project Structure

`
schedform/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder/
│   │   │   │   ├── FieldEditor.tsx
│   │   │   │   ├── FormPreview.tsx
│   │   │   │   └── FieldTypes.tsx
│   │   │   ├── Scheduler/
│   │   │   │   ├── CalendarView.tsx
│   │   │   │   ├── TimePicker.tsx
│   │   │   │   └── RecurrenceEditor.tsx
│   │   │   └── common/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   │   ├── formService.ts
│   │   │   ├── schedulerService.ts
│   │   │   └── cronService.ts
│   │   ├── routes/
│   │   └── middleware/
│   └── package.json
│
└── README.md