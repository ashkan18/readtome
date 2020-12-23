defmodule Readtome.Books do
  @moduledoc """
  The Books context.
  """

  import Ecto.Query, warn: false
  alias Readtome.Repo

  alias Readtome.Books.{Book, BookAuthor}
  alias Readtome.BooksFinder

  @doc """
  Returns the list of books.

  ## Examples

      iex> list_books()
      [%Book{}, ...]

  """
  def list_books do
    Repo.all(Book)
    |> Repo.preload(instances: :user)
    |> Repo.preload(:authors)
  end

  @doc """
  Gets a single book.

  Raises `Ecto.NoResultsError` if the Book does not exist.

  ## Examples

      iex> get_book!(123)
      %Book{}

      iex> get_book!(456)
      ** (Ecto.NoResultsError)

  """
  def get_book!(id), do: Repo.get!(Book, id)

  @doc """
  Creates a book.

  ## Examples

      iex> create_book(%{field: value})
      {:ok, %Book{}}

      iex> create_book(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_book(attrs \\ %{}) do
    %Book{}
    |> Book.changeset(attrs)
    |> Repo.insert()
  end

  def upsert_book(attrs \\ %{}) do
    %Book{}
    |> Book.changeset(attrs)
    |> Repo.insert_or_update()
  end

  def copy_external(%{isbn: isbn, title: title, tags: tags, description: _description}) do
    create_book(%{isbn: isbn, title: title, tags: tags})
  end

  def populate_with_external(book, %{authors: authors, cover_url: cover_url}) do
    authors
    |> Enum.map(fn au -> Readtome.Authors.add_by_name(au) end)
    |> Enum.map(fn au -> set_book_author(au, book) end)

    with {:ok, file} <- Readtome.BookCover.store({cover_url, book}) do
      book
      |> update_book(%{
        medium_cover_url: Readtome.BookCover.url({file, book}, :medium),
        small_cover_url: Readtome.BookCover.url({file, book}, :small),
        large_cover_url: Readtome.BookCover.url({file, book}, :large)
      })
    else
      error -> IO.inspect(error)
    end
  end

  def set_book_author(author, book) do
    %BookAuthor{}
    |> BookAuthor.changeset(%{author_id: author.id, book_id: book.id})
    |> Repo.insert()
  end

  @doc """
  Updates a book.

  ## Examples

      iex> update_book(book, %{field: new_value})
      {:ok, %Book{}}

      iex> update_book(book, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_book(%Book{} = book, attrs) do
    book
    |> Book.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Book.

  ## Examples

      iex> delete_book(book)
      {:ok, %Book{}}

      iex> delete_book(book)
      {:error, %Ecto.Changeset{}}

  """
  def delete_book(%Book{} = book) do
    Repo.delete(book)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking book changes.

  ## Examples

      iex> change_book(book)
      %Ecto.Changeset{source: %Book{}}

  """
  def change_book(%Book{} = book) do
    Book.changeset(book, %{})
  end

  alias Readtome.Books.BookInstance

  @doc """
  Returns the list of book_instance.

  ## Examples

      iex> list_book_instance()
      [%BookInstance{}, ...]

  """
  def list_book_instance(%{term: term, lat: lat, lng: lng, offerings: offerings}) do
    point = %Geo.Point{coordinates: {lng, lat}, srid: 4326}

    BookInstance
    |> by_term(term)
    |> by_offerings(offerings)
    |> near(point)
    |> preload(:user)
    |> preload(book: :authors)
    |> Repo.all()
  end

  def near(query, nil), do: query

  def near(query, point) do
    {lng, lat} = point.coordinates

    from(book_instance in query,
      order_by: fragment("? <-> ST_SetSRID(ST_MakePoint(?,?), ?)", book_instance.location, ^lng, ^lat, ^point.srid)
    )
  end

  def by_term(query, nil), do: query

  def by_term(query, term) do
    from(book_instance in query,
      join: user in assoc(book_instance, :user),
      join: book in assoc(book_instance, :book),
      join: author in assoc(book, :authors),
      where: fragment("LOWER(?) % LOWER(?) OR LOWER(?) = LOWER(?) OR LOWER(?) % LOWER(?)", book.title, ^term, user.name, ^term, author.name, ^term),
      order_by: fragment("similarity(LOWER(?), LOWER(?)) DESC", book.title, ^term)
    )
  end

  def by_offerings(query, nil), do: query

  def by_offerings(query, offerings) do
    from(book_instance in query,
      where: fragment("offerings in (?)", ^offerings)
    )
  end

  def by_isbn(isbn) do
    Book
    |> Repo.get_by(isbn: isbn)
    |> Repo.preload(instances: :user)
    |> Repo.preload(:authors)
  end

  @doc """
  Gets a single book_instance.

  Raises `Ecto.NoResultsError` if the Book instance does not exist.

  ## Examples

      iex> get_book_instance!(123)
      %BookInstance{}

      iex> get_book_instance!(456)
      ** (Ecto.NoResultsError)

  """
  def get_book_instance!(id), do: Repo.get!(BookInstance, id)

  @doc """
  Creates a book_instance.

  ## Examples

      iex> create_book_instance(%{field: value})
      {:ok, %BookInstance{}}

      iex> create_book_instance(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_book_instance(user, attrs = %{lat: lat, lng: lng}) do
    attrs =
      attrs
      |> Map.put(:location, %Geo.Point{coordinates: {lng, lat}, srid: 4326})
      |> Map.put(:user_id, user.id)

    %BookInstance{}
    |> BookInstance.changeset(attrs)
    |> Repo.insert()
  end

  def create_book_instance(_, _), do: {:error, :missing_coordinates}

  @doc """
  Updates a book_instance.

  ## Examples

      iex> update_book_instance(book_instance, %{field: new_value})
      {:ok, %BookInstance{}}

      iex> update_book_instance(book_instance, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_book_instance(%BookInstance{} = book_instance, attrs) do
    book_instance
    |> BookInstance.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a BookInstance.

  ## Examples

      iex> delete_book_instance(book_instance)
      {:ok, %BookInstance{}}

      iex> delete_book_instance(book_instance)
      {:error, %Ecto.Changeset{}}

  """
  def delete_book_instance(%BookInstance{} = book_instance) do
    Repo.delete(book_instance)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking book_instance changes.

  ## Examples

      iex> change_book_instance(book_instance)
      %Ecto.Changeset{source: %BookInstance{}}

  """
  def change_book_instance(%BookInstance{} = book_instance) do
    BookInstance.changeset(book_instance, %{})
  end

  def find_in_the_wild(isbn) do
    case by_isbn(isbn) do
      nil ->
        with {:found, founded_book} <- BooksFinder.by_isbn(isbn),
             {:ok, stored_book} <- copy_external(founded_book) do
          Task.async(fn -> populate_with_external(stored_book, founded_book) end)
          {:found_and_stored, %{book: stored_book, external: founded_book}}
        else
          _ -> {:not_found}
        end

      book ->
        {:found, book}
    end
  end

  def populate(model, attrs) do
    Repo.preload(model, attrs)
  end
end
