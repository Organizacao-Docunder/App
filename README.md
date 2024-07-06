<p align="center">
  <img src="https://github.com/Organizacao-Docunder/base-system/assets/57466763/8a195e39-5536-4cda-872d-ad77d9b25666" width="200" alt="Docunder Logo"/>
</p>
The Docunder project is a platform for technical documentation of hardware, software, and methodologies, aiming to be collaborative and lightweight. It can be used by a server for institution-controlled access, allowing for the creation, editing, sharing and efficient organization of technical documents.

## Usage 🏗
For this project you will need installed in your computer [Docker](https://docs.docker.com/get-docker/) installed in your computer.

## Environment 🌲
Before running the project, you will need to set the Postgres credentions you want to use in your `.env` file. <br>
Create a copy of the `.env.template` and rename it to `.env`

Change all the variables with your credentials.
> Note: Remember to put the SAME credentials in the DATABASE_URL as in the POSTGRES variables


## Running the app ⚙
Now that everythings has been set up, you can run all the containers by:
```bash
docker-compose up -d
```
You can acess the app at http://localhost:3000/ from your host system.
<br>
You can also use `docker-compose up --build` to force Docker to rebuild the container, if you think some of your code was not added up.


#### If you want to stop the containers use:
```bash
docker-compose down
```

## Stay in touch 🙋‍♂️

If you liked this project, please leave a ⭐.

Follow us in our [Linkedin](https://www.linkedin.com/company/docunder/) page.


## License

Docunder is [MIT licensed](LICENSE).
