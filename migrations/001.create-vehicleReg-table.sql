CREATE TABLE vehicle_admission (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	VisitGroup TEXT NOT NULL,
    DateEntry TEXT NOT NULL,
	TimeEntry TEXT NOT NULL,
	VehicleReg TEXT NOT NULL,
	VehicleType Text NOT NULL,
	Purpose Text NOT NULL
);