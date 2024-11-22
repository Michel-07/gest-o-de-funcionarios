import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Importando a biblioteca para exportar para Excel
import './App.css'; // Importando o CSS

const EmployeeManagement = () => {
  // Estado para armazenar os dados dos funcionários
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

  // Carregar os dados do LocalStorage ao iniciar o componente
  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    setEmployees(storedEmployees);
  }, []);

  // Salvar os dados dos funcionários no LocalStorage sempre que o estado de employees mudar
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  // Função para lidar com o envio do formulário
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!lgpdAccepted) {
      alert('Você deve aceitar os termos da LGPD.');
      return;
    }
    const newEmployee = {
      name,
      position,
      salary,
      startDate,
      endDate,
    };
    setEmployees([...employees, newEmployee]);
    resetForm();
  };

  // Função para deletar um funcionário da lista
  const handleDeleteEmployee = (index) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    setEmployees(updatedEmployees);
  };

  // Função para resetar o formulário após o envio
  const resetForm = () => {
    setName('');
    setPosition('');
    setSalary('');
    setStartDate('');
    setEndDate('');
    setLgpdAccepted(false);
  };

  // Função para exportar os dados para Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Funcionários');
    XLSX.writeFile(workbook, 'funcionarios.xlsx');
  };

  return (
    <div className="container">
      <h1>Gestão de Funcionários</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cargo"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Salário"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Data de Entrada"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Data de Saída"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <div className="lgpd">
          <input
            type="checkbox"
            checked={lgpdAccepted}
            onChange={(e) => setLgpdAccepted(e.target.checked)}
            required
          />
          <label>Aceito os termos da LGPD</label>
          <button
            type="button"
            onClick={() =>
              window.open('https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm', '_blank')
            }
          >
            Lei LGPD
          </button>
        </div>
        <button type="submit">Adicionar Funcionário</button>
      </form>
      <button onClick={exportToExcel} className="export-btn">
        Exportar para Excel
      </button>
      <ul id="employeeList">
        {employees.map((employee, index) => (
          <li key={index}>
            <div className="employee-details">
              <p>Nome: {employee.name}</p>
              <p>Cargo: {employee.position}</p>
              <p>Salário: R${employee.salary}</p>
              <p>Data de Entrada: {employee.startDate}</p>
              <p>Data de Saída: {employee.endDate || 'N/A'}</p>
            </div>
            <button
              className="delete-btn"
              onClick={() => handleDeleteEmployee(index)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeManagement;