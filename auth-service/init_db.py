from sqlmodel import SQLModel, Session, select
from db import engine
from models import User
from security import hash_password


def init_admin_user():
    """
    Initialise la base de données et crée un utilisateur admin
    si aucun utilisateur portant ce nom n'existe encore.
    """
    print("Initialisation de la base d'utilisateurs...")

    # Création des tables si elles n'existent pas déjà
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Vérifier l'existence d'un utilisateur admin
        admin = session.exec(select(User).where(User.username == "admin")).first()
        if admin:
            print("Utilisateur 'admin' déjà présent.")
        else:
            hashed_pw = hash_password("admin")
            session.add(User(username="admin", password_hash=hashed_pw))
            session.commit()
            print("Utilisateur administrateur créé (username=admin / password=admin)")

        # Vérification et création de pimprenel
        pimprenel = session.exec(select(User).where(User.username == "pimprenel")).first()
        if pimprenel:
            print("Utilisateur 'pimprenel' déjà présent.")
        else:
            hashed_pw = hash_password("pimprenel")
            session.add(User(username="pimprenel", password_hash=hashed_pw))
            session.commit()
            print("Utilisateur pimprenelistrateur créé (username=pimprenel / password=pimprenel)")



if __name__ == "__main__":
    init_admin_user()