// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use log::info;
use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};
// use tauri_plugin_log::LogTarget;

#[derive(Clone, serde::Serialize)]

struct PayloadEmpty {}

fn main() {
    let mut menu = Menu::new();
    {
        menu = menu.add_submenu(Submenu::new(
            "pixalateit".to_string(),
            Menu::new()
                .add_native_item(MenuItem::About(
                    "pixalateit".to_string(),
                    AboutMetadata::default(),
                ))
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("save", "Save"))
                .add_item(CustomMenuItem::new("load", "Load"))
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Quit),
        ));
    }

    // referer: tauri::Menu::os_default;
    tauri::Builder::default()
        // .plugin(
        //     tauri_plugin_log::Builder::default()
        //         .targets([
        //             LogTarget::Stdout,
        //             LogTarget::LogDir,
        //             // LogTarget::Webview
        //         ])
        //         .build(),
        // )
        .menu(menu)
        .on_menu_event(|event| match event.menu_item_id() {
            "quit" => {
                std::process::exit(0);
            }
            "close" => {
                event.window().close().unwrap();
            }
            "save" => {
                // print save
                print!("save");
                info!("save");
                event
                    .window()
                    .emit("backend_save", PayloadEmpty {})
                    .unwrap();
            }
            "load" => {
                // print load
                print!("load");
                info!("load");
                event
                    .window()
                    .emit("backend_load", PayloadEmpty {})
                    .unwrap();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
