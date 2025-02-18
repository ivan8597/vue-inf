
export const formatPhoneNumber = (input: string) => {
  const rawInput = input.replace(/[^\d]/g, ""); // Удаляем все нецифровые символы
  let formatted = "+7(";

  if (rawInput.length > 1) {
    formatted += rawInput.substring(1, 4) + ")";
  }
  if (rawInput.length >= 4) {
    formatted += rawInput.substring(4, 7) + "-";
  }
  if (rawInput.length >= 7) {
    formatted += rawInput.substring(7, 9) + "-";
  }
  if (rawInput.length >= 9) {
    formatted += rawInput.substring(9, 11);
  }

  return formatted; // Возвращаем отформатированное значение
};




export const validateInput = (event: KeyboardEvent) => {//функция  ограничивает ввод в текстовых полях только буквами 
  const char = String.fromCharCode(event.keyCode);
  if (!/^[a-zA-Zа-яА-ЯёЁ]+$/.test(char)) {
    event.preventDefault();//предотвращает добавление символа в поле ввода
  }
};;



