class DropPartnershipsTable < ActiveRecord::Migration[5.2]
  def change
    drop_table :partnerships
  end
end
