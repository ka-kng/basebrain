# Basebrainアプリ API仕様書

---

## 1. ユーザー認証系

## 1-1. ユーザー登録

- **URL**: POST `/api/register`
- **説明**: 新規ユーザー登録を行い、「チームを作成」または「招待コードで既存チームに参加」する。
- **リクエスト例**:
  json
  チーム作成の場合
  {
    "name": "山田太郎",
    "email": "yamada@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "team_mode": "create",
    "team_name": "○○高校",
  }

  チームに参加した場合
  {
    "name": "山田太郎",
    "email": "yamada@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "team_mode": "join",
    "team_name": "ABCD1234",
  }

## 1-2. ユーザーログイン

- **URL**: POST `/api/login`
- **説明**: 登録済みユーザーがメールアドレスとパスワードでログインします。
- **リクエスト例**:
  json
  {
    "email": "yamada@example.com",
    "password": "password123",
  }

## 1-3. ログアウト

- **URL**: POST `/api/logout`
- **説明**: ログイン中のユーザーをログアウトします。
- **リクエスト例**:
  json
  {
  }

## 1-4. ログインユーザー情報取得

- **URL**: GET `/api/user`
- **説明**: 現在ログイン中のユーザー情報を取得する。
- **リクエスト例**:
  json
  {
    "id": 12,
    "name": "山田太郎",
    "email": "yamada@example.com",
    "role": "player",
    "team_id": 5,
    "created_at": "2025-08-02T15:00:00Z",
    "updated_at": "2025-08-02T15:00:00Z"
  }


## 2. チーム・選手管理系

## 2-1. チーム情報取得

- **URL**: GET `/api/teams/{id}`
- **説明**: 指定したチームの詳細情報を取得する。ログインユーザーが所属するチームかどうかチェックあり。
- **リクエスト例**:
  json
  {
    "id": 1,
    "name": "〇〇高校",
    "invite_code": "ABCD1234",
    "created_at": "2025-07-01T10:00:00Z",
    "updated_at": "2025-07-20T12:00:00Z"
  }

## 2-2. チーム所属選手一覧取得

- **URL**: GET `/api/teams/{id}/players`
- **説明**: 指定チームに所属し、role が "player" のユーザー一覧を取得する。
- **リクエスト例**:
  json
  {
    "id": 1,
    "name": "山田太郎",
    "email": "yamada@example.com",
    "role": "player",
    "team_id": 1,
    "created_at": "2025-08-02T15:00:00Z",
    "updated_at": "2025-08-02T15:00:00Z"
  }

## 2-3. 選手詳細情報取得

- **URL**: GET `/api/users/{id}`
- **説明**: 指定ユーザー（選手または首脳陣）の詳細情報を取得する。ログインユーザーが同じチームに所属している必要あり。
- **リクエスト例**:
  json
  {
    "id": 1,
    "name": "山田太郎",
    "email": "yamada@example.com",
    "role": "player",
    "team_id": 1,
    "created_at": "2025-08-02T15:00:00Z",
    "updated_at": "2025-08-02T15:00:00Z"
  }

## 2-4. チームスケジュール一覧取得

- **URL**: GET `/api/teams/{id}/schedules`
- **説明**: 指定チームのスケジュール一覧を取得する。
- **リクエスト例**:
  json
  {
    "id": 100,
    "team_id": 1,
    "type": "試合",
    "date": "2025-08-15",
    "time": "13:00:00",
    "location": "〇〇球場",
    "note": "対△△高校戦",
    "created_at": "2025-08-01T10:00:00Z",
    "updated_at": "2025-08-01T10:00:00Z"
  }

## 3. 試合管理系

## 3-1. 試合一覧取得

- **URL**: GET `/api/teams/{id}/games`
- **説明**: 指定チームの試合一覧を取得する。日付降順（新しい順）で並べる。
- **リクエスト例**:
  json
  {
    "id": 101,
    "team_id": 1,
    "game_type": "練習試合",
    "tournament": "",
    "opponent": "〇〇中学校",
    "date": "2025-08-01",
    "team_score": 4,
    "opponent_score": 2,
    "memo": "初回に3得点",
    "created_at": "2025-08-01T17:00:00Z",
    "updated_at": "2025-08-01T17:00:00Z"
  }

## 3-2. 試合詳細(成績含む)

- **URL**: GET `/api/games/{id}`
- **説明**: 指定した試合の詳細情報を取得し、打撃成績・投手成績もまとめて返す。
- **リクエスト例**:
  json
  {
    "id": 101,
  "team_id": 1,
  "game_type": "練習試合",
  "opponent": "〇〇中学校",
  "date": "2025-08-01",
  "team_score": 4,
  "opponent_score": 2,
  "memo": "初回に3得点",
  "batting_records": [
    {
      "id": 1,
      "user_id": 12,
      "order_no": 1,
      "position": "CF",
      "at_bats": 4,
      "hits": 2,
      "rbis": 1,
      "runs": 2,
      "steals": 1,
      "caught_stealing": 0,
      "errors": 0,
      "walks": 1,
      "strikeouts": 1
    }
  ],
  "pitching_records": [
    {
      "id": 1,
      "user_id": 15,
      "result": "勝",
      "innings": 6.2,
      "pitches": 89,
      "earned_runs": 1,
      "runs_allowed": 2,
      "hits_allowed": 5,
      "hr_allowed": 0,
      "strikeouts": 6,
      "walks_given": 1
    }
  ]
  }

## 3-3. 試合登録（管理者用）

- **URL**: POST `/api/games`
- **説明**: 新しい試合と打撃成績・投手成績を登録する（管理者権限が必要）。
- **リクエスト例**:
  json
  {
    "id": 101,
  "team_id": 1,
  "game_type": "練習試合",
  "opponent": "〇〇中学校",
  "date": "2025-08-01",
  "team_score": 4,
  "opponent_score": 2,
  "memo": "初回に3得点",
  "batting_records": [
    {
      "id": 1,
      "user_id": 12,
      "order_no": 1,
      "position": "CF",
      "at_bats": 4,
      "hits": 2,
      "rbis": 1,
      "runs": 2,
      "steals": 1,
      "caught_stealing": 0,
      "errors": 0,
      "walks": 1,
      "strikeouts": 1
    }
  ],
  "pitching_records": [
    {
      "id": 1,
      "user_id": 15,
      "result": "勝",
      "innings": 6.2,
      "pitches": 89,
      "earned_runs": 1,
      "runs_allowed": 2,
      "hits_allowed": 5,
      "hr_allowed": 0,
      "strikeouts": 6,
      "walks_given": 1
    }
  ]
  }


## 3-4. 試合更新

- **URL**: PUT `/api/games/{id}`
- **説明**: 試合の内容（スコア、相手名、メモなど）を編集。権限：首脳陣のみ。
- **リクエスト例**:
  json
  {
    "team_score": 4,
    "opponent_score": 4,
    "memo": "引き分けに修正"
  }

## 3-5. 試合削除

- **URL**: DELETE `/api/games/{id}`
- **説明**: 指定試合を削除。権限：首脳陣のみ。
- **リクエスト例**:
  json
  {
    "message": "試合を削除しました。"
  }


## 4. 試合管理系

## 4-1. チーム成績集計取得

- **URL**: GET `/api/teams/{id}/stats`
- **説明**: 指定チームの試合データから、チーム全体の打撃・投手成績（累積 or 平均）を集計して取得。
- **リクエスト例**:
  json
  {
    "batting": {
      "games": 10,
      "at_bats": 300,
      "hits": 90,
      "average": 0.300,
      "rbis": 55,
      "runs": 48
    },
    "pitching": {
      "games": 10,
      "innings": 85.1,
      "earned_runs": 30,
      "era": 3.17,
      "strikeouts": 78,
      "walks_given": 25
    }
  }

## 4-2. チーム内打撃・投手ランキング

- **URL**: GET `/api/teams/{id}/ranking`
- **説明**: 指定チーム内の打率・打点・本塁打・防御率・奪三振などでランキング形式にして返す。
- **リクエスト例**:
  json
  {
     "batting_average": [
    { "user_id": 12, "name": "山田太郎", "average": 0.350 },
    { "user_id": 15, "name": "佐藤次郎", "average": 0.333 }
    ],
    "era": [
    { "user_id": 18, "name": "田中三郎", "era": 2.45 },
    { "user_id": 20, "name": "鈴木健太", "era": 3.10 }
    ]
  }


## 5. チームスケジュール登録・編集系

## 5-1. スケジュール登録

- **URL**: POST `/api/schedules`
- **説明**: チームの新しいスケジュール（試合、練習など）を登録する。権限：首脳陣のみ。
- **リクエスト例**:
  json
  {
  "team_id": 1,
  "type": "練習",
  "date": "2025-08-20",
  "time": "09:00:00",
  "location": "市営グラウンド",
  "note": "通常練習"
  }

## 5-2. スケジュール更新

- **URL**: PUT `/api/schedules/{id}`
- **説明**: 指定スケジュールの内容を編集。権限：首脳陣のみ。
- **リクエスト例**:
  json
  {
    {
      "type": "練習試合",
      "date": "2025-08-21",
      "time": "13:00:00",
      "location": "〇〇高校グラウンド",
      "note": "練習試合 vs △△高校"
    }
  }

## 5-3. スケジュール削除

- **URL**: DELETE `/api/schedules/{id}`
- **説明**: 指定スケジュールを削除。権限：首脳陣のみ。
- **リクエスト例**:
  json
  {
    {
      "message": "スケジュールを削除しました。"
    }
  }


## 6. 成績個別編集API（打撃・投手）

## 6-1. 打撃成績 追加

- **URL**: POST `/api/games/{game_id}/batting-records`
- **説明**: 指定試合に対して、選手の打撃成績を1件追加する（首脳陣権限が必要）。
- **リクエスト例**:
  json
  {
    "user_id": 12,
    "order_no": 3,
    "position": "1B",
    "at_bats": 4,
    "hits": 1,
    "rbis": 0,
    "runs": 1,
    "steals": 1,
    "caught_stealing": 0,
    "errors": 0,
    "walks": 1,
    "strikeouts": 2
  }

## 6-2. 打撃成績 更新

- **URL**: PUT `/api/batting-records/{id}`
- **説明**: 打撃成績1件を編集（首脳陣権限が必要）。
- **リクエスト例**:
  json
  {
  "hits": 2,
  "rbis": 1,
  "strikeouts": 1
  }

## 6-3. 打撃成績 削除

- **URL**: DELETE  `/api/batting-records/{id}`
- **説明**: 特定の打撃成績を削除。
- **リクエスト例**:
  json
  {
  }

## 6-4. 投手成績 追加

- **URL**: POST `/api/games/{game_id}/pitching-records`
- **説明**: 指定試合に対して、選手の投手成績を1件追加する（首脳陣権限が必要）。
- **リクエスト例**:
  json
  {
    "user_id": 15,
    "result": "勝",
    "innings": 5.1,
    "pitches": 80,
    "earned_runs": 2,
    "runs_allowed": 3,
    "hits_allowed": 5,
    "hr_allowed": 1,
    "strikeouts": 4,
    "walks_given": 2
  }

## 6-5. 打撃成績 更新

- **URL**: PUT `/api/pitching-records/{id}`
- **説明**: 投手成績1件を編集（首脳陣権限が必要）。
- **リクエスト例**:
  json
  {
  "pitches": 56,
  "strikeouts": 4,
  "hits_allowed": 3
  }


## 6-3. 打撃成績 削除

- **URL**: DELETE  `/api/pitching-records/{id}`
- **説明**: 特定の投手成績を削除。
- **リクエスト例**:
  json
  {
  }
