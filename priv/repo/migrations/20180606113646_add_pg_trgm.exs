defmodule Readtome.Repo.Migrations.AddPgTrgm do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS pg_trgm"
    execute "CREATE INDEX book_name_idx ON books USING gist (name gist_trgm_ops)"
  end
end
