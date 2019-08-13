class ChangeUsersReferences < ActiveRecord::Migration[5.2]
  def change
    change_table :users do |t|
      t.change index: true, foreign_key: true
    end
  end
end
