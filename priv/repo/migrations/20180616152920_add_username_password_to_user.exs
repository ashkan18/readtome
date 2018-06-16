defmodule Readtome.Repo.Migrations.AddUsernamePasswordToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :username, :string
      add :password, :string
    end
  end
end
