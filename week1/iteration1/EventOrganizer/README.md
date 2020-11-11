# Documentation

### Създаване на ново събитие

`CreateParty()` е конструктор функцията, която генерира нов обект и приема следните аргументи:
- `eventName`: име на събитието
- `areAdultsAllowed`: дефинира дали събитието е подходящо за лица над 18 години, по подразбиране: `true`

Като резултат връща обекти с автоматично генерирано ID с помощта на `generateID()` функцията. Обекта има следните методи:
- `getInfo()`: листва важна информация за текущо събитие
- `addClient()`: добавя клиент към `clients[]` масива ако клиента има години за събитието (**не е добре измислено**, всеки клиент е добре да получи ID)
- `getClients()`: листва всички клиенти за текущо събитие
- `filterClientsByGender()`: листва всички клиенти по пол (`male`, `female`, `prefer not to say`)
- `deleteClient()`: изтрива клиент по име (**не е добре измислено**, ще го направя по ID)

При успешно създаване на обект, той се съхранява в `eventStorageCollection[]` масива.

### Създаване на нов клиент

`CreateClient()` е конструктор функцията, която генерира нов обект и примеа следните аргументи
- `firstName`: име
- `lastName`: фамилия
- `sex`: пол
- `age`: години

### Helpers functions

- `isValidString()`
- `isValidBool()`
- `isNameValid()`
- `isSexValid()`
- `isAgeValidInt()`
- `getAllEvents()`
- `getAllEventsById()`
- `deleteEventById()`
- `updateEventById()`
- `capitalizeFirstLetter()`
- `generateID()`

---

Това е първи прототип. Спагети код - трябва да се направи и измисли както трябва!