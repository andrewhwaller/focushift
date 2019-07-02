class AddLocationToContexts < ActiveRecord::Migration[5.2]
  def change
    add_column :contexts, :location, :string
  end
end
