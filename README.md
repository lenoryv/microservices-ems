# Microservices PuntoPymes
Microservicios para la empresa Puntopymes CIA

**Resumen:** La empresa Puntopymes CIA, necesita llevar el control de sus empleados, es decir, la hora
de entrada y de salida:

## Requisitos
Se necesita tener instalado:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/downloads)

Opcional un editor de código:
- [Visual Studio Code](https://code.visualstudio.com)

## Instalación
### Opción 1
A través de Git Bash, ejecutando el siguiente comando para clonar el repositorio:
~~~
git clone https://github.com/lenoryv/microservices-puntopymes.git
~~~
### Variables de entorno
Crear un archivo _.env_ dentro de las carpetas _microservice-a_ y _microservice-b_. Definir las siguientes variables de entorno:
- URL_MONOGODB = "mongodb://admin:admin@mongodb:27017/<INSERT_NAME>?authSource=admin"
- PORT = <número de puerto>

**Nota:** Los puertos deben ser diferentes para cada microservicio.

Luego abrir el repositorio en su editor de código de preferencia y abir Docker Desktop en su computador. Ejecutar el comando, para crear e iniciar los contenedores:
~~~
docker compose up
~~~
**Nota:** Para detener y eliminar los contenedores, redes. Puede ejecutar el siguiente comando:
~~~
docker compose down
~~~
### Opción 2
Descargando únicamente el archivo .yml ubicado en la raiz del proyecto denominado _docker-compose-hub_, utilizando el comando:
~~~
docker compose -f docker-compose-hub.yml up
~~~
## Docker Hub
Imágenes de los microservicios disponibles en Docker Hub:
- [Microservicio A](https://hub.docker.com/repository/docker/lenoryv/microservice-a)
- [Microservicio B](https://hub.docker.com/repository/docker/lenoryv/microservice-b)

Otras imágenes utilizadas en el proyecto para almacenar los datos y realizar la comunicación de los microservicios respectivamente:
- [MongoDB](https://hub.docker.com/_/mongo)
- [RabbitMQ](https://hub.docker.com/_/rabbitmq)

## Métodos de Petición HTTP
Para realizar las siguientes peticiones se necesita de alguna plataforma API, cómo por ejemplo:
- [Postman](https://www.postman.com/downloads/)
- [Insomnia](https://insomnia.rest/download)
- Extensión para Visual Studio code [RapidAPI](https://rapidapi.com/guides/categories/rapidapi-client-vscode)
- Aplicación móvil [Restler](https://play.google.com/store/apps/details?id=br.tiagohm.restler&hl=es&gl=US&pli=1)
### Microservicio A
_Puerto 3000_

Inicio de sesión Administrator:
~~~
GET http://localhost:3000/user/login?username=YOUR_USERNAME&password=YOUR_PASSWORD
~~~
Obtener la lista de empleados:
~~~
GET http://localhost:3000/user/employees
~~~
Buscar informacion de un empleado por ID
~~~
GET http://localhost:3000/user/employee?employeeID=INSERT_EMPLOYEEID
~~~
Registrar un nuevo empleado:
~~~
POST http://localhost:3000/user/employee/create
~~~
Estructura del _Body_ para registrar un nuevo empleado, enviando los siguientes parámetros:
~~~
{
    "name": "NAME_EMPLOYEE",
    "age": 23
}
~~~
Actualizar información de un empleado por el ID:
~~~
PUT http://localhost:3000/user/employee/update?employeeID=INSERT_EMPLOYEEID
~~~
Estructura del _Body_ para actaulizar un empleado, enviando los parámetros que requiera actualizar:
~~~
{
    "name": "UPDATE_NAME",
    "age": 24
}
~~~
Eliminar un empleado por ID:
~~~
DEL http://localhost:3000/user/employee/delete?employeeID=INSERT_EMPLOYEEID
~~~
## Microservicio B
_Puerto 3002_
Obtener reporte de cuantas horas ha trabajado un empleado:
~~~
GET http://localhost:3002/report/hours?employeeID=INSERT_EMPLOYEEID
~~~
Estructura del _Body_ para obtener reporte de horas de un empleado, enviando el rango de tiempo _startDate_ (Fecha de Inicio) y _endDate_ (Fecha Fin):
~~~
{
	"startDate": "2021-11-16T13:30:00.000Z",
	"endDate": "2021-11-19T13:30:00.000Z"
}
~~~
**Nota:** Formato de fecha _Year-Month-DayTHour:Min:Sec.MilsecZ_

Lista de todos los reportes almacenados:
~~~
http://localhost:3002/report/
~~~
Registro de entrada y salidas de los empleados:
~~~
http://localhost:3002/report/create?employeeID=INSERT_EMPLOYEEID
~~~
Estructura del _Body_ para registrar un nuevo reporte, enviando los siguientes parámetros, _entryTime_ (Tiempo de entrada) y _exitTime_ (Tiempo de Salida):
~~~
{
	"entryTime": "2021-11-19T08:30:00.000Z",
	"exitTime": "2021-11-19T13:30:00.000Z"
}
~~~
# [Nestjs](https://docs.nestjs.com)
El proyecto esta desarrollado con Nest (NestJS) el cual es un _framework_ para crear aplicaciones del lado del servidor Node.js eficientes y escalables . Utiliza JavaScript progresivo, está construido con TypeScript y es totalmente compatible (pero aún permite a los desarrolladores codificar en JavaScript puro) y combina elementos de OOP (Programación orientada a objetos), FP (Programación funcional) y FRP (Programación reactiva funcional).
# [RabbitMQ](https://docs.nestjs.com/microservices/rabbitmq#rabbitmq)
Para realizar la comunicación de los microservicios se utiliza RabbitMQ el cual es un intermediario de mensajes ligero y de código abierto que admite múltiples protocolos de mensajería. Se puede implementar en configuraciones distribuidas y federadas para cumplir con los requisitos de gran escala y alta disponibilidad. Además, es el intermediario de mensajes más implementado, utilizado en todo el mundo en pequeñas empresas emergentes y grandes empresas.

Para realizar la comunicacion entre nuestro microservicios necesitamos de un corredor RabbitMQ. La forma más rápida de hacerlo funcionar es usando Docker . Podemos generar un contenedor RabbitMQ con el siguiente comando.
~~~
$ docker run -d --hostname demo-rabbit -p 5672:5672 -p 15672:15672 --name demo-rabbit rabbitmq:3-management
~~~
Usamos específicamente la imagen de administración de rabbitmq:3 . Esto habilitará la consola de administración de RabbitMQ. Además, exponemos dos puertos 5672 y 15672. Una vez que se inician los contenedores, podemos iniciar sesión en la consola de administración (http://localhost:15672) utilizando la identificación de usuario _guest_ y la contraseña _guest_.

Para usar el transportador RabbitMQ, pase el siguiente objeto de opciones al método _createMicroservice()_ en el archivo _main.js_:
~~~
PATH microservice-a/src/main.js
~~~
~~~typescript
app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'reports_queue',
      queueOptions: { durable: false },
      prefetchCount: 1,
    },
  });
~~~
**Importante:** Si utiliza Docker Compose para construir una imagen tanto del Microservicio como del RabbitMQ al igual que en este projecto, el nombre del hostname debe ser igual al servicio dentro del docker-compose.yml. Por ejemplo si se denomina _rabbitmq_
~~~yml
version: "3.8"
services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: nest-rabbitmq
    hostname: nest-rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    environment: 
      RABBITMQ_DEFAULT_PASS: guest
      RABBITMQ_DEFAULT_USER: guest
~~~
~~~typescript
app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'reports_queue',
      queueOptions: { durable: false },
      prefetchCount: 1,
    },
  });
~~~
Ahora se podrá suscribir a mensajes o eventos dentro del servicio utilizando un contexto, como ejemplo _validate_. Recibe una variable de tipo _string_ y deuelve un _boolean_
~~~
microservice-a/src/app.controller.ts
~~~
~~~typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';


@Controller('employee')
export class AppController {
  constructor(private appService: AppService) {}
  ...
  //RabbitMQ
  @MessagePattern({ cmd: 'validate' })
  async getGreetingMessageAysnc(employeeID: string): Promise<boolean> {
    const validated = await this.appService.validateEmployee(employeeID);
    return validated;
  }
}
~~~
### Cliente

Al igual que otros transportadores de microservicios, tiene varias opciones para crear una instancia de RabbitMQ _ClientProxy_.

Según la documentación Nestjs
~~~typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'cats_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ]
  ...
})
~~~
**Aplicado al projecto:** Básicamente, se uutiliza el método _register()_ de _ClientsModule_ para registrar un corredor RabbitMQ. Luego se especifica un nombre de token como por ejemplo REPORT_SERVICE para el servicio. Este token permite inyectar este servicio en cualquier parte de la aplicación.
~~~
PATH microservice-b/src/app.module.ts
~~~
~~~typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'reports_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ...
})
~~~
~~~
PATH microservice-b/src/app.service.ts
~~~
~~~typescript
import { Inject, Injectable } from '@nestjs/common';

import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Report') private readonly reportModel: Model<Report>,
    @Inject('REPORT_SERVICE') private readonly client: ClientProxy,
  ) {}
    ...
  //RabbitMQ
  async sendEmployeeID(employeeID: string) {
    const message = this.client.send<boolean>({ cmd: 'validate' }, employeeID);
    return message;
  }
}
~~~
Como se puede ver, se utiliza el decorador _@Inject()_ para inyectar el servicio de _report-service_ usando _ClientProxy_ . A continuación, se puede hacer uso de los métodos _send()_ y _emit()_ para enviar mensajes o publicar eventos. Luego, estos eventos se enrutan al intermediario (específicamente reports_queue ) desde donde el servicio de empleados recibe esos mensajes y actúa en consecuencia.

En este caso se envía un _employeeID_ utilizando el contexto _validate_. Según la respuesta del Microservicio A se realizara el correcto registro de entrada y salida de un empleado:
~~~
PATH microservice-b/src/app.controller.ts
~~~
~~~typescript
//Validate EmployeeID with RabbitMQ message and create Report
  @Post('/create')
  async sendEmployeeID(
    @Res() res,
    @Body() createReportDTO: CreateReportDTO,
    @Query('employeeID') employeeID,
  ) {
    const validatedEmployee = await this.appService.sendEmployeeID(employeeID);
    validatedEmployee.subscribe(async (data) => {
      if (data) {
        const { entryTime, exitTime } = createReportDTO;
        const newReport: CreateReportDTO = {
          employeeID: employeeID,
          entryTime: entryTime,
          exitTime: exitTime,
        };
        try {
          const report = await this.appService.createReport(newReport);
          return res.status(HttpStatus.OK).json({
            message: 'Report Successfully Created',
            report,
          });
        } catch (error) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            message: error,
          });
        }
      } else {
        return res.status(HttpStatus.OK).json({
          message: 'Employee Does Not Exist',
        });
      }
    });
~~~
