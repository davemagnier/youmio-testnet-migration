#!/usr/bin/env python3
"""
Script to process blockchain event log files and extract specific events.

This script processes all CSV files in the chain-logs directory, filters for
Transfer events (topic0 = 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef),
and extracts the address (topic2) and tokenId (topic3) values into a new CSV file.
"""

import csv
import glob
import os
from datetime import datetime

# Constants
TARGET_TOPIC0 = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
CHAIN_LOGS_DIR = "chain-logs"
OUTPUT_DIR = "."


def get_csv_files():
    """Get all CSV files in the chain-logs directory."""
    pattern = os.path.join(CHAIN_LOGS_DIR, "*.csv")
    return glob.glob(pattern)


def process_csv_file(file_path, output_data):
    """
    Process a single CSV file and extract relevant data.

    Args:
        file_path (str): Path to the CSV file
        output_data (list): List to append extracted data tuples (address, tokenId)
    """
    try:
        with open(file_path, "r", newline="", encoding="utf-8") as csvfile:
            # Use comma as default delimiter, which is most common for CSV files
            reader = csv.reader(csvfile, delimiter=",")

            # Read header
            header = next(reader, None)
            if not header:
                print(f"Warning: Empty file {file_path}")
                return

            # Find column indices
            try:
                topic0_idx = header.index("topic0")
                topic2_idx = header.index("topic2")
                topic3_idx = header.index("topic3")
            except ValueError as e:
                print(f"Warning: Missing required columns in {file_path}: {e}")
                return

            # Process rows
            for row_num, row in enumerate(
                reader, start=2
            ):  # start=2 because header is row 1
                if len(row) <= max(topic0_idx, topic2_idx, topic3_idx):
                    print(
                        f"Warning: Row {row_num} in {file_path} has insufficient columns"
                    )
                    continue

                # Filter by topic0
                if row[topic0_idx] == TARGET_TOPIC0:
                    # Format address as standard EVM address (last 40 characters prefixed with "0x")
                    raw_address = row[topic2_idx]
                    if raw_address.startswith("0x"):
                        # Extract last 40 characters and prefix with "0x"
                        formatted_address = "0x" + raw_address[-40:]
                    else:
                        # If no "0x" prefix, take last 40 characters and add prefix
                        formatted_address = (
                            "0x" + raw_address[-40:]
                            if len(raw_address) >= 40
                            else "0x" + raw_address
                        )

                    # Convert tokenId from hex to decimal
                    raw_token_id = row[topic3_idx]
                    try:
                        # Remove "0x" prefix if present and convert to decimal
                        if raw_token_id.startswith("0x"):
                            decimal_token_id = int(raw_token_id, 16)
                        else:
                            decimal_token_id = int(raw_token_id, 16)
                        formatted_token_id = str(decimal_token_id)
                    except ValueError:
                        # If conversion fails, keep original value
                        formatted_token_id = raw_token_id

                    output_data.append((formatted_address, formatted_token_id))

    except FileNotFoundError:
        print(f"Error: File not found {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")


def write_output_file(data, timestamp):
    """
    Write extracted data to a timestamped CSV file.

    Args:
        data (list): List of tuples (address, tokenId)
        timestamp (str): Timestamp string for filename
    """
    filename = f"snapshot-{timestamp}.csv"
    filepath = os.path.join(OUTPUT_DIR, filename)

    try:
        with open(filepath, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            # Write header
            writer.writerow(["address", "tokenId"])
            # Write data
            writer.writerows(data)

        print(f"Successfully wrote {len(data)} records to {filepath}")
        return filepath
    except Exception as e:
        print(f"Error writing output file: {e}")
        return None


def main():
    """Main function to process all log files."""
    print("Starting blockchain log processing...")

    # Check if chain-logs directory exists
    if not os.path.exists(CHAIN_LOGS_DIR):
        print(f"Error: Directory {CHAIN_LOGS_DIR} not found")
        return

    # Get all CSV files
    csv_files = get_csv_files()
    if not csv_files:
        print(f"No CSV files found in {CHAIN_LOGS_DIR}")
        return

    print(f"Found {len(csv_files)} CSV files to process")

    # Collect all extracted data
    extracted_data = []

    # Process each file
    for i, file_path in enumerate(csv_files, start=1):
        print(f"Processing file {i}/{len(csv_files)}: {os.path.basename(file_path)}")
        process_csv_file(file_path, extracted_data)

    # Generate timestamp for output file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Write output file
    if extracted_data:
        output_path = write_output_file(extracted_data, timestamp)
        if output_path:
            print("\nProcessing complete!")
            print(f"Total records extracted: {len(extracted_data)}")
            print(f"Output file: {output_path}")
    else:
        print("No matching records found across all files")


if __name__ == "__main__":
    main()

