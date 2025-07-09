import React from 'react';

interface CalendarProps {
  className?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: 'single' | 'multiple' | 'range';
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className = '', selected, onSelect, mode = 'single' }, ref) => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
    const [currentYear, setCurrentYear] = React.useState(today.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const handleDateClick = (day: number) => {
      const newDate = new Date(currentYear, currentMonth, day);
      onSelect?.(newDate);
    };

    const handlePrevMonth = () => {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    };

    const handleNextMonth = () => {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    };

    const renderDays = () => {
      const days = [];

      // Empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
      }

      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const isSelected =
          selected &&
          date.getDate() === selected.getDate() &&
          date.getMonth() === selected.getMonth() &&
          date.getFullYear() === selected.getFullYear();

        days.push(
          <button
            key={day}
            onClick={() => handleDateClick(day)}
            className={`w-8 h-8 text-sm rounded hover:bg-blue-100 ${
              isSelected ? 'bg-blue-600 text-white' : 'text-gray-700'
            }`}
          >
            {day}
          </button>
        );
      }

      return days;
    };

    return (
      <div
        ref={ref}
        className={`p-4 bg-white border border-gray-200 rounded-md shadow ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-gray-100">
            ←
          </button>
          <h3 className="text-lg font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button onClick={handleNextMonth} className="p-1 rounded hover:bg-gray-100">
            →
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div
              key={day}
              className="w-8 h-8 text-xs font-medium text-gray-500 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export { Calendar };
