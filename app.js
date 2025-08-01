// app.js actualizado con selector visual de fecha

const agendaForm = document.getElementById('agendaForm');
const confirmacion = document.getElementById('confirmacion');
const calendarContainer = document.createElement('div');
calendarContainer.id = 'calendar';
calendarContainer.style.display = 'none';
document.querySelector('.agenda').appendChild(calendarContainer);

const fechaInput = document.getElementById('fecha');

let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
let currentDate = new Date();

fechaInput.addEventListener('focus', () => {
    calendarContainer.style.display = 'block';
});

document.addEventListener('click', function (e) {
    if (!calendarContainer.contains(e.target) && e.target !== fechaInput) {
        calendarContainer.style.display = 'none';
    }
});

agendaForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    if (nombre && email && fecha && hora) {
        const nuevaReserva = { nombre, email, fecha, hora };
        reservas.push(nuevaReserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));

        confirmacion.innerHTML = `<p>Gracias ${nombre}, tu turno para el ${fecha} a las ${hora} fue reservado correctamente.</p>`;
        confirmacion.classList.add('success');
        
        agendaForm.reset();
        renderCalendar(currentDate);
    } else {
        alert('Por favor completa todos los campos');
    }
});

function renderCalendar(date) {
    calendarContainer.innerHTML = '';
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `
        <button id="prevMonth">&#8592;</button>
        <h3>${monthNames[month]} ${year}</h3>
        <button id="nextMonth">&#8594;</button>
    `;
    calendarContainer.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day-name';
        dayCell.textContent = day;
        grid.appendChild(dayCell);
    });

    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        grid.appendChild(emptyCell);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;

        const dayDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayReservas = reservas.filter(r => r.fecha === dayDate);

        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayCell.classList.add('today');
        }

        if (dayReservas.length > 0) {
            dayCell.classList.add('has-reservas');
        }

        dayCell.addEventListener('click', () => {
            fechaInput.value = dayDate;
            calendarContainer.style.display = 'none';
            mostrarReservas(dayDate);
        });

        grid.appendChild(dayCell);
    }

    calendarContainer.appendChild(grid);

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
}

function mostrarReservas(fecha) {
    const reservasDelDia = reservas.filter(r => r.fecha === fecha);
    if (reservasDelDia.length === 0) {
        console.log(`No hay reservas para ${fecha}`);
    } else {
        console.log(`Reservas para ${fecha}:`);
        reservasDelDia.forEach(r => {
            console.log(`- ${r.hora} - ${r.nombre}`);
        });
    }
}

renderCalendar(currentDate);
