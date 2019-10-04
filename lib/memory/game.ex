defmodule Memory.Game do
    
    def get_char_array(letters) do 
        letters
        |> String.split("")
        |> Enum.filter(fn x -> x != "" end)
        |> Enum.shuffle()
        |> Enum.map(fn x -> {x, "hidden"} end)
    end

    def new do
        all_letter = String.duplicate("ABCDEFGH", 2)
        %{
            slotArray: get_char_array(all_letter),
            last_clicked_idx: -1,
            is_displaying: 0,
            number_of_click: 0,
        }
    end
    
    def client_view(game) do
        letter = game.slotArray
        %{
            slotArray: Enum.map(letter, fn cc ->
                if elem(cc, 1) == "revealed" do
                    elem(cc,0)
                else 
                    ""
                end end),
            number_of_click: game.number_of_click,
        }
    end

    def click(game, id_num) do
        {_, slot_status} = Enum.at(game.slotArray, id_num)
        cond do
            game.is_displaying == 0 &&
            slot_status == "hidden" ->
                handle_click(game, id_num)            
            true -> game
        end
    end


    defp updateState(temp_slots, last, displaying, num_click) do 
        game = Map.new()
        Map.put(game, :slotArray, temp_slots)
        |> Map.put(:last_clicked_idx, last)
        |> Map.put(:is_displaying, displaying)
        |> Map.put(:number_of_click, num_click)
    end

    defp handle_click(game, id_num) do
        temp_slots = game.slotArray
        last = game.last_clicked_idx
        displaying = 0
        {last_letter, _} = Enum.at(temp_slots, last)
        {curr_letter, _} = Enum.at(temp_slots, id_num)
        if last >= 0 do
            if (last_letter == curr_letter &&
            last != id_num) do
                temp_slots = List.replace_at(temp_slots, last, {last_letter, "revealed"})
                |> List.replace_at(temp_slots, id_num, {curr_letter, "revealed"})
                updateState(temp_slots, -1, 0, game.number_of_click+1)
            else
                temp_slots = List.replace_at(temp_slots, id_num, {last_letter, "revealed"})
                displaying = 1
                updateState(temp_slots, -1, displaying, game.number_of_click+1)
            end
        else
            temp_slots = List.replace_at(temp_slots, id_num, {curr_letter, "revealed"})
            updateState(temp_slots, id_num, 0, game.number_of_click+1)
        end
    end

end