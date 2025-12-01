Below is a brief overview of the Vue application. It is a meeting-creation widget used by operators to schedule appointments between a lawyer/company and a client, both in online and offline formats.

The application automatically adjusts the meeting time to the user’s browser timezone using dayjs, and it also displays the client’s timezone to avoid confusion. Company offices and lawyers are loaded lazily as they enter the viewport to reduce unnecessary initial data loading.

The interface includes a modal dialog with additional details for each office and a dropdown for switching between a company’s offices. The backend provides a “calendar” in the form of an array, which is used to generate a date-and-time slider that takes into account booked time slots and exceptions configured in the company’s dashboard.

Since meetings are created by operators rather than clients, the interface allows operators to select company offices and lawyers as part of the scheduling flow.
