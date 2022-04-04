const express = require('express');

const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointmentRouter');
const doctorRoutes = require('./routes/doctorRouter');
const patientRoutes = require('./routes/patientRouter');
const medicineRoutes = require('./routes/medicineRouter');
const prescriptionRoutes = require('./routes/prescriptionRouter');
const recordRoutes = require('./routes/recordRouter');
const meetingRoutes = require('./routes/meetingRouter');
const app = express();



app.use(bodyParser.json());


app.use('/api',appointmentRoutes.routes);
app.use('/api',doctorRoutes.routes);
app.use('/api',patientRoutes.routes);
app.use('/api',medicineRoutes.routes);
app.use('/api',prescriptionRoutes.routes);
app.use('/api',recordRoutes.routes);
app.use('/api',meetingRoutes.routes);

// app.post('/appointment', addAppointment);
// app.get('/appointment', getAppointment);
// app.delete('/appointment/:id',deleteAppointment);
// app.put('/appointment/:id', updateAppointment);
// app.patch('/appointment/:id', editAppointment);

const PORT = 5000;
app.listen(PORT, () =>console.log(`Server running on port: http://localhost:${PORT}`));
