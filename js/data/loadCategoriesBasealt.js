export async function loadAndProcessData() {
  try {
    const response = await fetch('./data/categories-basealt.json');
    const data = await response.json();
    //console.log('Данные успешно загружены:', data);
    return data; // Возвращаем данные
  } catch (error) {
    //console.error('Ошибка загрузки данных:', error);
    throw error; // Пробрасываем ошибку дальше
  }
}
