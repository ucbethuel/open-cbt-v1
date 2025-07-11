const handleCalculatorOperation = (value) => {
    if (value === 'C') {
      setCalculatorValue('0');
    } else if (value === '=') {
      try {
        const result = Function('"use strict"; return (' + calculatorValue + ')')();
        setCalculatorValue(result.toString());
      } catch (error) {
        setCalculatorValue('Error');
      }
    } else if (value === 'CE') {
      setCalculatorValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setCalculatorValue(prev => prev === '0' ? value : prev + value);
    }
  };

  export default handleCalculatorOperation;