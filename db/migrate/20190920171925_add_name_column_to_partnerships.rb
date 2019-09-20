class AddNameColumnToPartnerships < ActiveRecord::Migration[5.2]
  def change
    add_column :partnerships, :name, :string
  end
end
