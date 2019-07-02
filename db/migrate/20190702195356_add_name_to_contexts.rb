class AddNameToContexts < ActiveRecord::Migration[5.2]
  def change
    add_column :contexts, :name, :string
  end
end
