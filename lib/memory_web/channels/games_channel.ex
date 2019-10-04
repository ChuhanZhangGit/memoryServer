# Reference: Author: Nate Tuck source: https://github.com/NatTuck/hangman-2019-01
defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      BackupAgent.put(name, game)
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("click", %{"id" => id_num}, socket) do
    name = socket.assigns[:name]
    game = Game.click(socket.assigns[:game], id_num)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    IO.put "test game"
    IO.inspect(game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
