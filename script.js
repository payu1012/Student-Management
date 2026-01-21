// Student Management System - JavaScript 

// Global variables
let students = []; // Array to store all student records
let editingIndex = -1; // Track which student is being edited (-1 means not editing)

// DOM Elements
const studentForm = document.getElementById('studentForm');
const studentIdInput = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const studentClassInput = document.getElementById('studentClass');
const studentMarksInput = document.getElementById('studentMarks');
const tableBody = document.getElementById('tableBody');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('form-title');
const searchInput = document.getElementById('searchInput');
const noRecords = document.getElementById('noRecords');
const totalStudentsSpan = document.getElementById('totalStudents');

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadStudentsFromStorage(); // Load existing data from localStorage
    displayStudents(); // Display all students in table
});

// Event Listeners
studentForm.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', resetForm);
searchInput.addEventListener('input', handleSearch);

/**
 * Handle form submission (Add or Update student)
 */
function handleFormSubmit(e) {
    e.preventDefault(); // Prevent page reload
    
    const studentId = studentIdInput.value.trim();
    const studentName = studentNameInput.value.trim();
    const studentClass = studentClassInput.value.trim();
    const studentMarks = parseInt(studentMarksInput.value);
    
    if (!validateForm(studentId, studentName, studentClass, studentMarks)) {
        return;
    }
    
    const student = {
        id: studentId,
        name: studentName,
        class: studentClass,
        marks: studentMarks,
        grade: calculateGrade(studentMarks)
    };
    
    if (editingIndex === -1) {
        if (students.some(s => s.id === studentId)) {
            alert('Student ID already exists!');
            return;
        }
        students.push(student);
        alert('Student added successfully!');
    } else {
        const exists = students.find(
            (s, index) => s.id === studentId && index !== editingIndex
        );
        if (exists) {
            alert('Student ID already exists!');
            return;
        }
        students[editingIndex] = student;
        alert('Student updated successfully!');
        editingIndex = -1;
    }
    
    saveStudentsToStorage();
    displayStudents();
    resetForm();
}

/**
 * Validate form inputs
 */
function validateForm(id, name, cls, marks) {
    if (!id || !name || !cls || isNaN(marks)) {
        alert('All fields are required!');
        return false;
    }
    
    if (marks < 0 || marks > 100) {
        alert('Marks must be between 0 and 100!');
        return false;
    }
    
    return true;
}

/**
 * Calculate grade
 */
function calculateGrade(marks) {
    if (marks >= 90) return 'A';
    if (marks >= 75) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
}

/**
 * Display students in table
 */
function displayStudents(studentsToDisplay = students) {
    tableBody.innerHTML = '';
    
    if (studentsToDisplay.length === 0) {
        noRecords.style.display = 'block';
        totalStudentsSpan.textContent = '0';
        return;
    }
    
    noRecords.style.display = 'none';
    
    studentsToDisplay.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.class}</td>
            <td>${student.marks}</td>
            <td>
                <span class="grade grade-${student.grade.toLowerCase()}">
                    ${student.grade}
                </span>
            </td>
            <td>
                <button class="action-btn edit-btn"
                    onclick="editStudent(${students.indexOf(student)})">
                    Edit
                </button>
                <button class="action-btn delete-btn"
                    onclick="deleteStudent(${students.indexOf(student)})">
                    Delete
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    totalStudentsSpan.textContent = studentsToDisplay.length;
}

/**
 * Edit student
 */
function editStudent(index) {
    const student = students[index];
    
    studentIdInput.value = student.id;
    studentNameInput.value = student.name;
    studentClassInput.value = student.class;
    studentMarksInput.value = student.marks;
    
    editingIndex = index;
    formTitle.textContent = 'Edit Student';
    submitBtn.textContent = 'Update Student';
    cancelBtn.style.display = 'inline-block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Delete student
 */
function deleteStudent(index) {
    const student = students[index];
    
    if (confirm(`Delete ${student.name}?`)) {
        students.splice(index, 1);
        saveStudentsToStorage();
        displayStudents();
        alert('Student deleted!');
        
        if (editingIndex === index) {
            resetForm();
        }
    }
}

/**
 * Reset form
 */
function resetForm() {
    studentForm.reset();
    editingIndex = -1;
    formTitle.textContent = 'Add New Student';
    submitBtn.textContent = 'Add Student';
    cancelBtn.style.display = 'none';
}

/**
 * Search students
 */
function handleSearch() {
    const term = searchInput.value.toLowerCase().trim();
    
    if (!term) {
        displayStudents();
        return;
    }
    
    const filtered = students.filter(student =>
        student.id.toLowerCase().includes(term) ||
        student.name.toLowerCase().includes(term)
    );
    
    displayStudents(filtered);
}

/**
 * LocalStorage functions
 */
function saveStudentsToStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadStudentsFromStorage() {
    const data = localStorage.getItem('students');
    if (data) {
        students = JSON.parse(data);
    }
}

// Make functions global
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
