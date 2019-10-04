defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  # Source: Nat Tuck https://github.com/NatTuck/hangman-2019-01
  def game(conn, %{"name" => name}) do
    render conn, "game.html", name: name
  end

  def index(conn, _params) do
    render conn, "index.html"
  end
end
