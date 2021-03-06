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
            curr_clicked_idx: -1,
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
            is_displaying: game.is_displaying,
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


    def finish_timeout(game, _done) do 
        temp_slots = game.slotArray
        {last_letter, _} = Enum.at(temp_slots, game.last_clicked_idx)
        {curr_letter, _} = Enum.at(temp_slots, game.curr_clicked_idx)

        temp_slots = List.replace_at(temp_slots, game.last_clicked_idx, {last_letter, "hidden"})
        |> List.replace_at(game.curr_clicked_idx, {curr_letter, "hidden"})
        updateState(temp_slots, -1, -1, 0, game.number_of_click)
    end

    def restart(_game, _ev) do
        new()
    end
    
    defp updateState(temp_slots, last_idx, curr_idx, displaying, num_click) do 
        game = Map.new()
        Map.put(game, :slotArray, temp_slots)
        |> Map.put(:last_clicked_idx, last_idx)
        |> Map.put(:curr_clicked_idx, curr_idx)
        |> Map.put(:is_displaying, displaying)
        |> Map.put(:number_of_click, num_click)
    end

    defp handle_click(game, id_num) do
        temp_slots = game.slotArray
        last = game.last_clicked_idx
        {last_letter, _} = Enum.at(temp_slots, last)
        {curr_letter, _} = Enum.at(temp_slots, id_num)
        if last >= 0 do
            if (last_letter == curr_letter &&
            last != id_num) do
                temp_slots = List.replace_at(temp_slots, last, {last_letter, "revealed"})
                |> List.replace_at(id_num, {curr_letter, "revealed"})
                updateState(temp_slots, -1, -1, 0, game.number_of_click+1)
            else
                temp_slots = List.replace_at(temp_slots, id_num, {curr_letter, "revealed"})
                # 1 means current displaying two letters for a certain timeout period
                # 0 means not in timeout
                updateState(temp_slots, last, id_num, 1, game.number_of_click+1)
            end
        else
            temp_slots = List.replace_at(temp_slots, id_num, {curr_letter, "revealed"})
            updateState(temp_slots, id_num, -1, 0, game.number_of_click+1)
        end
    end

end