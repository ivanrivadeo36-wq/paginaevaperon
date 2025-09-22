// script.js - Funcionalidades mejoradas para el sitio del CAPS

// Estado de la aplicación
const appState = {
    isLoggedIn: false,
    userData: null,
    ageVerified: false,
    appointments: []
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Verificar si estamos en la página principal
    if (document.getElementById('age-verification-form')) {
        initAgeVerification();
    }
    
    // Configurar el cambio de logo
    const logoElement = document.getElementById('logo-caps');
    if (logoElement) {
        logoElement.addEventListener('click', function() {
            changeLogo();
        });
        
        // Cargar logo guardado si existe
        const savedLogo = localStorage.getItem('capsLogo');
        if (savedLogo) {
            logoElement.src = savedLogo;
        }
    }
    
    // Configurar formularios específicos
    if (document.getElementById('loginForm')) {
        setupLoginForm();
    }
    
    if (document.getElementById('appointmentForm')) {
        setupAppointmentForm();
    }
    
    if (document.getElementById('quickAppointmentForm')) {
        setupQuickAppointmentForm();
    }
    
    // Cargar turnos existentes
    loadAppointments();
});

// Inicializar la aplicación
function initializeApp() {
    // Cargar estado desde localStorage
    const savedState = localStorage.getItem('capsAppState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        Object.assign(appState, parsedState);
    }
    
    // Cargar turnos desde localStorage
    const savedAppointments = localStorage.getItem('capsAppointments');
    if (savedAppointments) {
        appState.appointments = JSON.parse(savedAppointments);
    }
    
    // Actualizar UI según el estado
    updateUI();
}

// Guardar estado de la aplicación
function saveAppState() {
    localStorage.setItem('capsAppState', JSON.stringify({
        isLoggedIn: appState.isLoggedIn,
        userData: appState.userData,
        ageVerified: appState.ageVerified
    }));
}

// Guardar turnos
function saveAppointments() {
    localStorage.setItem('capsAppointments', JSON.stringify(appState.appointments));
}

// Actualizar UI según el estado
function updateUI() {
    // Actualizar elementos según el estado de login
    const loginElements = document.querySelectorAll('[data-login-state]');
    loginElements.forEach(element => {
        const state = element.getAttribute('data-login-state');
        if (state === 'logged-in' && appState.isLoggedIn) {
            element.classList.remove('d-none');
        } else if (state === 'logged-out' && !appState.isLoggedIn) {
            element.classList.remove('d-none');
        } else {
            element.classList.add('d-none');
        }
    });
    
    // Actualizar según verificación de edad
    if (appState.ageVerified) {
        const ageRestrictedElements = document.querySelectorAll('[data-age-restricted]');
        ageRestrictedElements.forEach(element => {
            element.classList.remove('d-none');
        });
        
        const ageVerificationElements = document.querySelectorAll('[data-age-verification]');
        ageVerificationElements.forEach(element => {
            element.classList.add('d-none');
        });
    }
}

// Cambiar logo
function changeLogo() {
    const newLogo = prompt('Ingrese la URL del nuevo logo:');
    if (newLogo) {
        document.getElementById('logo-caps').src = newLogo;
        localStorage.setItem('capsLogo', newLogo);
    }
}

// Inicializar la verificación de edad
function initAgeVerification() {
    const ageForm = document.getElementById('age-verification-form');
    const ageResult = document.getElementById('age-result');
    
    ageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const birthdate = new Date(document.getElementById('birthdate').value);
        const age = calculateAge(birthdate);
        
        if (age < 18) {
            ageResult.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    <strong>Acceso denegado:</strong> Debes ser mayor de 18 años para utilizar nuestros servicios.
                </div>
            `;
            appState.ageVerified = false;
        } else {
            ageResult.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>¡Bienvenido!</strong> Gracias por verificar tu edad. Ahora puedes acceder a todos nuestros servicios.
                </div>
            `;
            appState.ageVerified = true;
            enableRestrictedFeatures();
        }
        
        saveAppState();
        updateUI();
    });
}

// Calcular edad basado en la fecha de nacimiento
function calculateAge(birthdate) {
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    
    return age;
}

// Habilitar características restringidas después de verificar la edad
function enableRestrictedFeatures() {
    console.log('Características habilitadas para mayor de edad');
}

// Configurar formulario de login
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simulación de login
        if (email && password) {
            appState.isLoggedIn = true;
            appState.userData = { email: email };
            saveAppState();
            updateUI();
            
            alert(`Inicio de sesión simulado para: ${email}`);
            // Redirigir a la página de turnos
            window.location.href = 'turnos.html';
        } else {
            alert('Por favor, complete todos los campos');
        }
    });
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = prompt('Por favor, ingrese su correo electrónico para recuperar su contraseña:');
            if (email) {
                alert(`Se ha enviado un enlace de recuperación a: ${email}`);
            }
        });
    }
}

// Configurar formulario de registro rápido
function setupQuickAppointmentForm() {
    const quickAppointmentForm = document.getElementById('quickAppointmentForm');
    
    if (quickAppointmentForm) {
        quickAppointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const idNumber = document.getElementById('idNumber').value;
            const specialty = document.getElementById('specialty').value;
            
            if (fullName && idNumber && specialty) {
                alert(`Solicitud de turno registrada para: ${fullName}\nDNI: ${idNumber}\nEspecialidad: ${specialty}`);
                // Redirigir a la página de turnos
                window.location.href = 'turnos.html';
            } else {
                alert('Por favor, complete todos los campos para solicitar el turno');
            }
        });
    }
}

// Configurar formulario de turnos
function setupAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        // Establecer fecha mínima como hoy
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        document.getElementById('appointment-date').min = todayStr;
        
        // Cargar parámetros de URL si existen
        const urlParams = new URLSearchParams(window.location.search);
        const specialty = urlParams.get('especialidad');
        const medico = urlParams.get('medico');
        
        if (specialty) {
            document.getElementById('specialty').value = specialty;
            loadDoctorsBySpecialty();
            
            // Una vez cargados los médicos, seleccionar el específico si viene en la URL
            setTimeout(() => {
                if (medico) {
                    document.getElementById('doctor').value = medico;
                }
            }, 100);
        }
        
        // Manejo del formulario de turnos
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const specialty = document.getElementById('specialty').value;
            const doctor = document.getElementById('doctor').value;
            const date = document.getElementById('appointment-date').value;
            const time = document.getElementById('appointment-time').value;
            const reason = document.getElementById('reason').value;
            const urgent = document.getElementById('urgent').checked;
            
            if (specialty && doctor && date && time && reason) {
                // Crear objeto de turno
                const appointment = {
                    id: Date.now(),
                    specialty: specialty,
                    doctor: doctor,
                    date: date,
                    time: time,
                    reason: reason,
                    urgent: urgent,
                    status: urgent ? 'Urgente - En revisión' : 'Pendiente',
                    createdAt: new Date().toISOString()
                };
                
                // Agregar a la lista de turnos
                appState.appointments.push(appointment);
                saveAppointments();
                
                // Formatear fecha para mostrar
                const dateObj = new Date(date);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = dateObj.toLocaleDateString('es-ES', options);
                
                // Mostrar resultado
                document.getElementById('appointmentResult').innerHTML = `
                    <div class="alert alert-success" role="alert">
                        <h5><i class="fas fa-check-circle me-2"></i> Turno solicitado correctamente</h5>
                        <p><strong>Profesional:</strong> ${doctor}</p>
                        <p><strong>Fecha:</strong> ${formattedDate}</p>
                        <p><strong>Hora:</strong> ${time}</p>
                        <p><strong>Motivo:</strong> ${reason}</p>
                        <p><strong>Estado:</strong> ${urgent ? 'Urgente - En revisión' : 'Pendiente de confirmación'}</p>
                        <hr>
                        <p class="mb-0">Recibirás un correo electrónico con la confirmación dentro de las próximas 24 horas.</p>
                    </div>
                `;
                
                // Agregar a la lista de turnos
                addAppointmentToList(appointment);
                
                // Limpiar formulario
                appointmentForm.reset();
                document.getElementById('doctor').innerHTML = '<option value="">Seleccione un profesional</option>';
            } else {
                alert('Por favor, complete todos los campos para solicitar el turno');
            }
        });
    }
}

// Cargar médicos según especialidad
function loadDoctorsBySpecialty() {
    const specialty = document.getElementById('specialty').value;
    const doctorSelect = document.getElementById('doctor');
    
    // Limpiar select
    doctorSelect.innerHTML = '<option value="">Seleccione un profesional</option>';
    
    // Simulación de datos - en un caso real se obtendrían de una base de datos
    const doctors = {
        general: ['Dr. Juan Pérez', 'Dra. María García', 'Dr. Carlos López'],
        nutrition: ['Lic. Ana Martínez', 'Lic. Roberto Sánchez'],
        psychology: ['Lic. Laura Fernández', 'Lic. Miguel Rodríguez'],
        pediatrics: ['Dra. Sofía Díaz', 'Dr. Javier Romero']
    };
    
    let availableDoctors = [];
    
    switch(specialty) {
        case 'general':
            availableDoctors = doctors.general;
            break;
        case 'nutrition':
            availableDoctors = doctors.nutrition;
            break;
        case 'psychology':
            availableDoctors = doctors.psychology;
            break;
        case 'pediatrics':
            availableDoctors = doctors.pediatrics;
            break;
        default:
            availableDoctors = [];
    }
    
    // Llenar el select con los médicos disponibles
    availableDoctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorSelect.appendChild(option);
    });
}

// Cargar turnos existentes
function loadAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (appointmentsList && appState.appointments.length > 0) {
        appointmentsList.innerHTML = '';
        
        appState.appointments.forEach(appointment => {
            addAppointmentToList(appointment);
        });
    }
}

// Agregar turno a la lista
function addAppointmentToList(appointment) {
    const appointmentsList = document.getElementById('appointmentsList');
    
    // Si no hay turnos, limpiar el mensaje por defecto
    if (appointmentsList && appointmentsList.innerHTML.includes('No hay turnos solicitados')) {
        appointmentsList.innerHTML = '';
    }
    
    // Formatear fecha para mostrar
    const dateObj = new Date(appointment.date);
    const formattedDate = dateObj.toLocaleDateString('es-ES');
    
    // Crear nueva fila
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${formattedDate}</td>
        <td>${appointment.time}</td>
        <td>${appointment.doctor}</td>
        <td><span class="badge bg-warning">${appointment.status}</span></td>
        <td>
            <button class="btn btn-sm btn-outline-danger cancel-btn" data-id="${appointment.id}">
                <i class="fas fa-times"></i> Cancelar
            </button>
        </td>
    `;
    
    if (appointmentsList) {
        appointmentsList.appendChild(newRow);
    }
    
    // Agregar evento al botón de cancelar
    newRow.querySelector('.cancel-btn').addEventListener('click', function() {
        const appointmentId = parseInt(this.getAttribute('data-id'));
        cancelAppointment(appointmentId);
    });
}

// Cancelar turno
function cancelAppointment(appointmentId) {
    if (confirm('¿Está seguro de que desea cancelar este turno?')) {
        // Encontrar y eliminar el turno
        const appointmentIndex = appState.appointments.findIndex(a => a.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            appState.appointments.splice(appointmentIndex, 1);
            saveAppointments();
            
            // Recargar la lista de turnos
            loadAppointments();
            
            alert('Turno cancelado correctamente');
        }
    }
}

// Cerrar sesión
function logout() {
    appState.isLoggedIn = false;
    appState.userData = null;
    saveAppState();
    updateUI();
    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html';
}