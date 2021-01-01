defmodule Readtome.Repo.Migrations.FixAuthorsIndex do
  use Ecto.Migration

  def change do
    drop constraint(:book_creators, "book_authors_pkey")
    drop constraint(:book_creators, "book_authors_author_id_fkey")
    drop constraint(:book_creators, "book_authors_book_id_fkey")

    alter table(:book_creators) do
      # "Modifying" the columns rengenerates the constraints with the correct
      # new names. These were the same types and options the columns were
      # originally created with in previous migrations.
      modify :id, :id, primary_key: true
      modify :book_id, references(:books)
      modify :creator_id, references(:creators)
    end

    execute "ALTER SEQUENCE book_authors_id_seq RENAME TO book_creators_id_seq;"
  end
end
