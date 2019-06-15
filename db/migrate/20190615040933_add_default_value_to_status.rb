class AddDefaultValueToStatus < ActiveRecord::Migration[5.2]
  def change
    change_column :tasks, :status, :integer, :default => 0
  end
end
