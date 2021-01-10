defmodule Readtome.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Readtome.Repo
  alias Comeonin.Bcrypt

  alias Readtome.Accounts.{User, UserInterest}
  alias Readtome.Creators

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  def get_user(id), do: Repo.get(User, id)

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def add_user_profile_photo(user, photo_url) do
    with {:ok, file} <- Readtome.UserProfile.store({photo_url, user}) do
      all_photos =
        [
          %{
            original: Readtome.UserProfile.url({file, user}, :original),
            thumb: Readtome.UserProfile.url({file, user}, :thumb),
            default: false
          }
        ]
        |> Enum.into(user.photos || [])

      update_user(user, %{photos: all_photos})
    else
      error -> IO.inspect(error)
    end
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a User.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{source: %User{}}

  """
  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end

  def authenticate_user(username, plain_text_pass) do
    Repo.get_by(User, username: username)
    |> check_password(plain_text_pass)
  end

  defp check_password(nil, _), do: {:error, "Incorrect username or password"}

  defp check_password(user, plain_text_password) do
    case Bcrypt.checkpw(plain_text_password, user.password) do
      true -> {:ok, user}
      false -> {:error, "Incorrect username or password"}
    end
  end

  @doc """
  Returns the list of user_interests.

  ## Examples

      iex> list_user_interests()
      [%UserInterest{}, ...]

  """
  def list_user_interests do
    Repo.all(UserInterest)
  end

  @doc """
  Gets a single user_interest.

  Raises `Ecto.NoResultsError` if the User interest does not exist.

  ## Examples

      iex> get_user_interest!(123)
      %UserInterest{}

      iex> get_user_interest!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user_interest!(id), do: Repo.get!(UserInterest, id)

  @doc """
  Creates a user_interest.

  ## Examples

      iex> create_user_interest(%{field: value})
      {:ok, %UserInterest{}}

      iex> create_user_interest(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user_interest(attrs \\ %{}) do
    with {creator_ids, attrs} <- Map.pop(attrs, :creator_ids),
         changeset <- UserInterest.changeset(%UserInterest{}, attrs),
         {:ok, user_interest} <- Repo.insert(changeset),
         Enum.map(creator_ids, fn creator_id -> Creators.create_user_interest_creator(%{user_interest_id: user_interest.id, creator_id: creator_id}) end) do
      {:ok, user_interest}
    else
      {:error, error = %Ecto.Changeset{}} -> {:error, error}
      error -> error
    end
  end

  @doc """
  Updates a user_interest.

  ## Examples

      iex> update_user_interest(user_interest, %{field: new_value})
      {:ok, %UserInterest{}}

      iex> update_user_interest(user_interest, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user_interest(%UserInterest{} = user_interest, attrs) do
    user_interest
    |> UserInterest.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user_interest.

  ## Examples

      iex> delete_user_interest(user_interest)
      {:ok, %UserInterest{}}

      iex> delete_user_interest(user_interest)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user_interest(%UserInterest{} = user_interest) do
    Repo.delete(user_interest)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user_interest changes.

  ## Examples

      iex> change_user_interest(user_interest)
      %Ecto.Changeset{data: %UserInterest{}}

  """
  def change_user_interest(%UserInterest{} = user_interest, attrs \\ %{}) do
    UserInterest.changeset(user_interest, attrs)
  end

  def user_interests(%User{id: user_id}, args \\ %{}) do
    from(ui in UserInterest,
      where: ui.user_id == ^user_id
    )
    |> filter_user_interests_by_type(args)
    |> sort_interests(args)
    |> Repo.all()
  end

  def filter_user_interests_by_type(query, %{interest_types: interest_types}) do
    from(ui in query,
      where: ui.type in ^interest_types
    )
  end

  def filter_user_interests_by_type(query, _), do: query

  def sort_interests(query, args) do
    sort_by =
      case args do
        %{sort_by: :created_desc} -> [desc: :inserted_at]
        _ -> [desc: :inserted_at]
      end

    query
    |> order_by(^sort_by)
  end

  def data() do
    Dataloader.Ecto.new(Repo)
  end
end
