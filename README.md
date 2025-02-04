# GUIDO — Gathering and Understanding Socio-Technical Aspects in Development Organizations

## Introduction

**GUIDO** Is a conversational agent designed to operate locally, accessible through an executable file, enabling the identification and management of *community smells* in software development communities on GitHub.

GUIDO is based on a previous tool for the detection of community smells, **CADOCS**, originally proposed by Voria et al. in a research paper published at ICSME 2022.

## How to Install The Tool

In the following, we report the main steps to install GUIDO on your machine.

### Preliminar: Generate a Github PAT

Follow these steps to create a Personal Access Token on GitHub:

1. **Navigate to GitHub:**
   - Login in to your github account.

2. **Access Settings:**
   - Click on your profile picture at the top right corner, and select **Settings** from the dropdown menu.

3. **Personal Access Tokens:**
   - In the left sidebar, click on **Developer settings**.
   - Then click on **Personal access tokens**.
   - Select **Tokens (classic)**.

4. **Set Expiration:**
   - Choose an expiration for your token. You can select a specific duration or opt for **No expiration**.

5. **Set Permissions:**
   - Assign the necessary permissions for your token. Typically, you might need to enable permissions such as `repo`, `write:discuss`, `project`, and `user`.

6. **Generate Token:**
   - Once you've configured the settings, click on **Generate token**.
   - You will see a string representing your new Personal Access Token. **Copy and securely store this token**—it's important!

**IMPORTANT**: Remember, your Personal Access Token is like a password—keep it secure and do not share it publicly.

Now you should also install **Docker**.

### Docker Image pull ARM64

If your machine is ARM64 based you should opt for these steps:
1. **Run the following command**:
   ```bash
   docker pull leopoldotodisco/guido-backend:latest
2. **Run the command**: 
    ```bash 
    docker pull leopoldotodisco/guido-frontend:latest
3. **Configure and start backend container backend via Docker Desktop**:
	- Open Docker Desktop.
	- Go in section **Images**.
	- find the image **leopoldotodisco/guido-backend:1.0** and click on Play button.
	- In **additional options**, add PAT in Env Variables and put the value of the PAT that you generated before.
	- Set **5005** as port number.
4. **Configure and start backend container backend via Docker Desktop**:
	- In Docker Desktop, Go in section **Images**.
	- find the image **leopoldotodisco/guido-frontend:1.0** and click on Play button.
	- Set **3000** as port number.
5. Start you brand new containers and **open localhost:3000 in your browser**

### Docker Image pull x86

If your machine is x86 based you should opt for these steps:
1. **Run the following command**:
   ```bash
   docker pull benedettoscala/guido-backend
2. **Run the command**: 
    ```bash 
    docker pull benedettoscala/guido-frontend
3. **Configure and start backend container backend via Docker Desktop**:
	- Open Docker Desktop.
	- Go in section **Images**.
	- find the image **benedettoscala/guido-backend** and click on Play button.
	- In **additional options**, add PAT in Env Variables and put the value of the PAT that you generated before.
	- Set **5005** as port number.
4. **Configure and start backend container backend via Docker Desktop**:
	- In Docker Desktop, Go in section **Images**.
	- find the image **benedettoscala/guido-frontend** and click on Play button.
	- Set **3000** as port number.
5. Start you brand new containers and **open localhost:3000 in your browser**

### Local Docker Build
1. Clone our Repository
2. Go in folder "docker" and add your PAT in dockerfile
3. Run the following commands:
 ```bash
	docker-compose build
	docker compose up 
```
5. **Open localhost:3000 in your browser**

## Other Tools

The entire CADOCS tool is composed of three modules:
- **CADOCS II** (this repository): The desktop application
- **CADOCS**: it is the Slack App used to interact with users.
- **CADOCS_NLU_Model** [link](https://github.com/alfcan/CADOCS_NLU_Model): it is the ML service used to interpret the users' intents.
- **csDetector** [link](https://github.com/PaoloCarmine1201/csDetector): the augmented and wrapped version of csDetector, used in our tool to detect community smells and other socio-technical metrics.
The links are referred to our modified versions of the tools.

## Detectable Community Smells

The complete list of detectable community smells—through the use of csDetector—and the associated refactoring strategies.

| Community Smell | Description | Refactoring Strategies |
|---|---|---|
| Organizational Silo | Siloed areas of the community that do not communicate, except through one or two of their respective members. | Restructure the community, Create communication plan, Mentoring, Cohesion exercising, Monitoring, and Introducing a social-rewarding mechanism. |
| Black Cloud | Information overload due to lack of structured communications or cooperation governance. | Create communication plan, Restructure the community, and Introduce a Social sanctioning mechanism. | 
| Radio Silence | One interposes herself into every formal interaction across more sub-communities with little flexibility to introduce other channels. | Restructure the community, Create communication plan, Mentoring, Cohesion exercising, Monitoring, and Introduce a Social sanctioning mechanism. | 
| Prima Donnas | A team of people is unwilling to respect external changes from other team members due to inefficiently structured collaboration. | NA | 
| Sharing Villainy | Cause of a lack of information exchange, team members share essential knowledge such as outdated, wrong and unconfirmed information. | NA | 
| Organizational Skirmish | A misalignment between different expertise levels of individuals involved in the project leads to dropped productivity and affects the project's timeline and cost. | NA | 
| Solution Defiance | The development community presents different levels of cultural and experience background, leading to the division of the community into similar subgroups with completely conflicting opinions. | NA | 
| Truck Factor Smell | Risk of significant knowledge loss due to the turnover of developers resulting from the fact that project information and knowledge are concentrated in a minority of the developers. | NA | 
| Unhealthy Interaction | Long delays in stakeholder communications cause slow, light and brief conversations and discussions. | NA | 
| Toxic Communication | Toxic interactions and conflicting opinions among developers could push them to leave the project. | NA |

