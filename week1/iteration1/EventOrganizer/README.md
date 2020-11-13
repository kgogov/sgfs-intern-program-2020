# Documentation (work in progress)

### Създаване на ново събитие

`Party()` е конструктор функцията, която генерира нов обект и приема следните аргументи:
- `partyName`: име на събитието
- `isSuitableForMinors`: дефинира дали събитието е подходящо за лица под 18 години, по подразбиране: `false`

Като резултат връща обекти с автоматично генерирано ID с помощта на `generateEventID()` функцията. Обекта има следните допълнителни методи:
- `toggleReservations()`: пуска/спира добавянето на клиенти
- `getFullEventInfo()`: листва цялата информация за текущо събитие
- `listClients([gender])`: листва всички клиенти за текущо събитие, може да бъде подаден аргумент: `male`, `female`, `prefer not to say`
- `listAllUnderAgedEvents()`: листва всички подходящи партита за малолетни
- `addClient()`: добавя клиент от тип обект `Client`, един и същи обект не може да бъде добавен, както и ако клиента не спазва условията  
- `removeClient()`: изтрива клиент ID

При успешно създаване на обект, той се съхранява в `PARTIES_COLLECTION[]` масива.

### Създаване на нов клиент

// Не е специално изискване към проекта: може да го махна.
Един клиенти трябва да има минимум **12** години за да бъде създаден.

`Client()` е конструктор функцията, която генерира нов обект и примеа следните аргументи
- `firstName`: име
- `lastName`: фамилия
- `gender`: пол
- `age`: години

Като резултат връща обекти с автоматично генерирано ID с помощта на `generateClientID()` функцията. Обекта има следните допълнителни методи:
- `getFullClientInfo()`